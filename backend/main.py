import uvicorn
import os 

if __name__ == "__main__":
    # Cloud Run gives us a PORT env var. If not found, default to 8000 (Localhost).
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Nexus Engine on port {port}")
    uvicorn.run("app.api.server:app", host="0.0.0.0", port=port, reload=True)