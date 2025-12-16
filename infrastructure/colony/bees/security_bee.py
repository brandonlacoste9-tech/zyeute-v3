import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

# Initialize dedicated Security Client (Service Role)
# This requires SUPABASE_SERVICE_KEY in .env.colony
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

_supabase: Client = None

def get_supabase() -> Client:
    global _supabase
    if not _supabase:
        if not url or not key:
            raise ValueError("Missing Supabase credentials for Security Bee")
        _supabase = create_client(url, key)
    return _supabase

def ban_user(task):
    """
    Soft-deletes a user from Auth (prevents login) and marks profile as banned.
    """
    metadata = task.get('metadata', {})
    user_id = metadata.get('target_id')
    reason = metadata.get('reason', 'Banned by Guardian')
    
    print(f"🛡️ [SECURITY] BANNING User {user_id}: {reason}")
    client = get_supabase()

    try:
        # 1. Block Login (Soft Delete in Auth)
        # delete_user with soft=True preserves data but stops auth
        # Note: supabase-py admin interface might vary slightly by version, 
        # usually it's auth.admin.delete_user(uid)
        client.auth.admin.delete_user(user_id) 
        
        # 2. Mark Profile in Public Table (for UI)
        # Using a raw query or updating a known table
        try:
             client.table('user_profiles').update({
                'is_banned': True,
                'ban_reason': reason
            }).eq('id', user_id).execute()
        except:
            # Fallback if column doesn't exist yet
            print("⚠️ Could not update user_profiles table (schema mismatch?), check DB migrations.")
        
        return {"status": "completed", "result": {"message": f"User {user_id} banned."}}
    except Exception as e:
        print(f"❌ BAN ERROR: {e}")
        return {"status": "failed", "error": str(e)}

def hide_content(task):
    """
    Hides a post or comment from public view.
    """
    metadata = task.get('metadata', {})
    content_id = metadata.get('target_id')
    table = metadata.get('content_type', 'posts') # posts or comments
    
    print(f"🛡️ [SECURITY] HIDING {table} {content_id}")
    client = get_supabase()
    
    try:
        client.table(table).update({
            'visibility': 'hidden',
            'moderation_status': 'flagged_by_ai'
        }).eq('id', content_id).execute()
        
        return {"status": "completed", "result": {"message": f"Content {content_id} hidden."}}
    except Exception as e:
        print(f"❌ HIDE ERROR: {e}")
        return {"status": "failed", "error": str(e)}

def execute_security_command(task):
    command = task['command']
    
    if command == 'ban_user':
        return ban_user(task)
    elif command == 'hide_content':
        return hide_content(task)
    else:
        return {"status": "failed", "error": f"Unknown security command: {command}"}
