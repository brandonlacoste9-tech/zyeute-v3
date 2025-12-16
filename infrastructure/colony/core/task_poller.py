import os
import sys
import time
import json
import requests
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Try importing standard libs, facilitate partial installs
try:
    import fal_client
except ImportError:
    fal_client = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

from supabase import create_client, Client

# Import the new Security Bee & Health Bee
from bees import security_bee
from bees import health_bee

# Load environment
script_dir = os.path.dirname(os.path.abspath(__file__))
# Add parent directory to path so we can import 'bees'
sys.path.append(os.path.dirname(script_dir))

# Try loading from colony env first (core/../.env.colony)
load_dotenv(os.path.join(script_dir, '../.env.colony'))
# Fallback/Additional from root
load_dotenv(os.path.join(script_dir, '../../../.env'))

# 1. Setup Supabase (The Hive Mind)
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
if not url or not key:
    print("❌ Critical: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY")
    exit(1)

supabase: Client = create_client(url, key)

# 2. Setup Gemini (The Eyes/Reflexes)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY and genai:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
    print("👀 [SENSORY CORTEX] Gemini Vision Online")
else:
    print("⚠️ [SENSORY CORTEX] Gemini Offline (Missing Key/Lib)")

# 3. Setup DeepSeek (The Brain/Logic)
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")

# --- PROCESSORS ---

def process_deepseek_task(task):
    """Routes logic/chat tasks to DeepSeek V3."""
    print(f"🧠 [NEUROSPHERE] DeepSeek V3 thinking about: {task['id']}")
    
    metadata = task.get('metadata', {})
    messages = metadata.get('messages', [])
    if not messages and 'prompt' in metadata:
        messages = [{"role": "user", "content": metadata['prompt']}]

    try:
        if not DEEPSEEK_API_KEY:
             raise ValueError("DeepSeek Key Missing")

        response = requests.post(
            "https://api.deepseek.com/chat/completions",
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "deepseek-chat", # V3
                "messages": messages,
                "temperature": 1.3 
            }
        )
        response.raise_for_status()
        result = response.json()['choices'][0]['message']['content']
        return {"status": "completed", "result": {"text": result}}
    except Exception as e:
        print(f"❌ DeepSeek Error: {e}")
        return {"status": "failed", "error": str(e)}

def process_gemini_vision_task(task):
    """Routes image analysis tasks to Gemini 2.5 Flash."""
    print(f"👀 [SENSORY CORTEX] Gemini Flash looking at image: {task['id']}")
    
    if not GEMINI_API_KEY or not genai:
         return {"status": "failed", "error": "Gemini not configured"}

    metadata = task.get('metadata', {})
    image_url = metadata.get('image_url')
    prompt = metadata.get('prompt', "Describe this image in detail.")
    
    try:
        img_data = requests.get(image_url).content
        response = gemini_model.generate_content([
            {'mime_type': 'image/jpeg', 'data': img_data},
            prompt
        ])
        return {"status": "completed", "result": {"description": response.text}}
    except Exception as e:
        print(f"❌ Gemini Vision Error: {e}")
        return {"status": "failed", "error": str(e)}

def process_fal_task(task):
    """Routes creation tasks (Video/Image) to Flux/Kling via FAL."""
    command = task['command']
    metadata = task.get('metadata', {})
    
    # Check if this is a resumption of a waiting task
    if task.get('status') == 'async_waiting':
        request_id = metadata.get('fal_request_id')
        print(f"🎨 [ACTION LAYER] Checking status for FAL Request: {request_id}")
        
        try:
            status = fal_client.status("fal-ai/kling-video/v1/standard/text-to-video", request_id, with_logs=True)
            if status['status'] == 'COMPLETED':
                result = fal_client.result("fal-ai/kling-video/v1/standard/text-to-video", request_id)
                return {"status": "completed", "result": {"video_url": result['video']['url']}}
            elif status['status'] == 'FAILED':
                 return {"status": "failed", "error": "FAL Generation Failed"}
            else:
                # Still running
                return {"status": "async_waiting", "result": None} # No change
        except Exception as e:
            print(f"❌ FAL Check Error: {e}")
            return {"status": "async_waiting", "error": str(e)} # Keep waiting on transient errors

    # Start new task
    print(f"🎨 [ACTION LAYER] FAL generating {command} for: {task['id']}")
    
    if not fal_client:
         return {"status": "failed", "error": "fal-client lib missing"}
         
    try:
        if command == 'generate_video':
            # Use Kling - Submit ASYNC
            handler = fal_client.submit(
                "fal-ai/kling-video/v1/standard/text-to-video",
                arguments={
                    "prompt": metadata.get('prompt', 'A cool video'),
                    "aspect_ratio": "16:9",
                    "duration": "5"
                }
            )
            # Store request ID and go to waiting state
            request_id = handler.request_id
            print(f"⏳ [ACTION LAYER] Video Job Submitted (ID: {request_id}). Waiting...")
            
            # Update metadata with request ID
            new_metadata = metadata.copy()
            new_metadata['fal_request_id'] = request_id
            
            # We need to update metadata in DB, but process_task returns result.
            # We'll return a special result that main_loop handles.
            return {
                "status": "async_waiting", 
                "result": {"message": "Job submitted"},
                "metadata_update": new_metadata
            }
            
        elif command == 'generate_image':
            # Use Flux Schnell (Fast enough to keep sync for now, or make async if >10s)
            handler = fal_client.submit(
                "fal-ai/flux/schnell",
                arguments={
                    "prompt": metadata.get('prompt', 'A cool image'),
                    "image_size": "square_hd"
                }
            )
            result = handler.get()
            return {"status": "completed", "result": {"image_url": result['images'][0]['url']}}
            
    except Exception as e:
        print(f"❌ FAL Error: {e}")
        return {"status": "failed", "error": str(e)}

def process_task(task):
    """The Hive Mind Router"""
    command = task['command']
    metadata = task.get('metadata', {})
    target_bee = metadata.get('target_bee')

    # ROUTING LOGIC
    
    # 0. HEALTH
    if command in ['check_vitals', 'cleanup_systems'] or target_bee == 'health_bee':
        return health_bee.handle_task(command, metadata)

    # 1. SECURITY
    elif command in ['ban_user', 'hide_content'] or target_bee == 'security_bee':
        return security_bee.execute_security_command(task)

    # 2. INTELLIGENCE
    elif command in ['chat', 'improve_text', 'write_script']:
        return process_deepseek_task(task)
    
    # 3. VISION
    elif command in ['analyze_image', 'scan_moderation']:
        return process_gemini_vision_task(task)
        
    # 4. CREATION (Supports Async)
    elif command in ['generate_image', 'generate_video']:
        return process_fal_task(task)
        
    else:
        return {"status": "failed", "error": f"Unknown command: {command}"}

def main_loop():
    print("🐝 [HIVE MIND] Colony OS Triad Poller Online (Hardened Mode)...")
    print("   🛡️ Security | 🔺 Gemini | 🧠 DeepSeek | 🎨 Flux/Kling | 🩺 Health")
    
    while True:
        try:
            # 1. Fetch PENDING tasks (New Work)
            response = supabase.table('colony_tasks')\
                .select("*")\
                .eq('status', 'pending')\
                .order('priority', desc=True)\
                .limit(1)\
                .execute()
            
            pending_tasks = response.data
            
            # 2. Fetch ASYNC WAITING tasks (Ongoing Work)
            # Only fetch if we didn't get a pending task, or interleave them.
            # For simplicity, we check waiting tasks every loop too.
            waiting_response = supabase.table('colony_tasks')\
                .select("*")\
                .eq('status', 'async_waiting')\
                .limit(5)\
                .execute()
                
            waiting_tasks = waiting_response.data
            
            # Process Waiting Tasks
            for task in waiting_tasks:
                print(f"🔄 Checking Async Task {task['id']} ({task['command']})...")
                result = process_task(task)
                
                if result['status'] != 'async_waiting':
                    # It finished or failed!
                    supabase.table('colony_tasks').update({
                        'status': result['status'],
                        'result': result.get('result', {}),
                        'error': result.get('error'),
                        'completed_at': datetime.now().isoformat()
                    }).eq('id', task['id']).execute()
            
            # Process New Tasks
            if pending_tasks:
                task = pending_tasks[0]
                print(f"\n⚡ Starting Task {task['id']}: {task['command']}")
                
                # Mark as processing
                supabase.table('colony_tasks').update({
                    'status': 'processing',
                    'worker_id': os.getpid(), # Track who is working on it
                    'started_at': datetime.now().isoformat()
                }).eq('id', task['id']).execute()
                
                # Execute Logic
                result = process_task(task)
                
                # Update DB Based on Result
                update_payload = {
                    'status': result['status'],
                    'result': result.get('result', {}),
                    'error': result.get('error')
                }
                
                if result['status'] == 'completed':
                    update_payload['completed_at'] = datetime.now().isoformat()
                elif result.get('metadata_update'):
                    # Task went async, update metadata (e.g. store request_id)
                    update_payload['metadata'] = result['metadata_update']
                
                supabase.table('colony_tasks').update(update_payload).eq('id', task['id']).execute()
                
            if not pending_tasks and not waiting_tasks:
                time.sleep(2) 
                
        except Exception as e:
            print(f"⚠️ Loop Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        print("\n👋 Hive Mind Sleeping...")
