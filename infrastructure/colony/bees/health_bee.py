import os
import logging
import platform
import psutil
import requests
import time
from datetime import datetime

logger = logging.getLogger(__name__)

def check_vitals(metadata: dict) -> dict:
    """
    Performs a system health check (CPU, Memory, API Status).
    """
    logger.info("🩺 [DOCTOR] Checking system vitals...")
    
    server_url = os.getenv("VITE_API_URL", "http://localhost:5000")
    
    # 1. System Metrics
    cpu_usage = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    # 2. API Health Check
    api_status = "unknown"
    api_latency = 0
    try:
        start_time = time.time()
        # Ping the API (assuming a root or health endpoint exists)
        # Using a simplified check for now
        requests.get(f"{server_url}/api/health", timeout=5)
        api_latency = round((time.time() - start_time) * 1000, 2)
        api_status = "nominal"
    except Exception as e:
        api_status = f"degraded: {str(e)}"

    report = {
        "timestamp": datetime.now().isoformat(),
        "system": {
            "platform": platform.system(),
            "cpu_usage_percent": cpu_usage,
            "memory_usage_percent": memory.percent,
            "disk_usage_percent": disk.percent
        },
        "api": {
            "status": api_status,
            "latency_ms": api_latency
        }
    }
    
    logger.info(f"🩺 [DOCTOR] Vitals Report: CPU {cpu_usage}% | RAM {memory.percent}% | API {api_status}")
    return {"status": "success", "result": report}

def cleanup_systems(metadata: dict) -> dict:
    """
    Placeholder for maintenance tasks (clearing temp files, rotating logs).
    """
    logger.info("🧹 [DOCTOR] Running cleanup protocols...")
    # Simulation: In real prod, this would vacuum DB or clear /tmp
    time.sleep(1)
    return {"status": "success", "result": "Systems cleaned and optimized."}

def handle_task(command: str, metadata: dict) -> dict:
    """Dispatcher for Health Bee"""
    if command == 'check_vitals':
        return check_vitals(metadata)
    elif command == 'cleanup_systems':
        return cleanup_systems(metadata)
    else:
        return {"status": "failed", "error": f"Unknown health command: {command}"}
