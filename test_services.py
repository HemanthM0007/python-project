import asyncio
import os
import sys
import logging

# Initialize logging so we can see API details
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")

# Add the app directory to path so we can import services
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__))))

from app.services.geocoding import geocode_address
from app.services.maps import get_satellite_map
from app.services.ai_engine import detector
from app.core.config import settings

async def main():
    print("=== Testing Solar Verification Services ===")
    
    # Test address
    test_address = "P.B No.206 Kannada Sahitya Parishat Road , 3rd Stage Gokulam,Mysore,Karnataka 570002"
    print(f"\n1. Geocoding address: '{test_address}'")
    coords = await geocode_address(test_address)
    
    if not coords:
        print("[-] Geocoding failed!")
        return
        
    lat, lon = coords
    print(f"[+] Successfully geocoded! Coordinates: Lat {lat}, Lon {lon}")
    
    # Test satellite downloader
    print("\n2. Fetching satellite imagery (Google / Mapbox / ESRI)...")

    test_image_name = "test_raw.png"
    test_annotated_name = "test_annotated.png"
    
    original_path = os.path.join(settings.IMAGES_DIR, test_image_name)
    annotated_path = os.path.join(settings.IMAGES_DIR, test_annotated_name)
    
    success = await get_satellite_map(lat, lon, original_path, zoom=19)
    
    if not success:
        print("[-] Satellite image fetch failed!")
        return
        
    print(f"[+] Satellite image downloaded and saved to: {original_path}")
    
    # Test AI/OpenCV detection
    print("\n3. Running Solar Panel detection...")
    detected, count, area, confidence = detector.detect(original_path, annotated_path, zoom=19)
    
    print(f"[+] Detection results:")
    print(f"    - Panels detected: {detected}")
    print(f"    - Count: {count}")
    print(f"    - Estimated Area: {area} sqm")
    print(f"    - Confidence: {confidence}")
    print(f"    - Annotated image saved to: {annotated_path}")
    print("\n=== Test Completed Successfully ===")

if __name__ == "__main__":
    asyncio.run(main())
