import zipfile
import os
import json
import sys
import io
from PIL import Image, ImageDraw

# Reconfigure stdout to handle encoding errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Configuration
ZIP_FILES = [
    "1주차_데이터.zip", # Contains 2D Bounding Box data
    "1주차_보완데이터.zip" # Contains 2D/3D Supplementary data
]
BASE_DIR = r"C:\Users\M I C R O S P A C E\Desktop\My Projects\AI-Programme-Vibe-Coding\Week1_Data"
OUTPUT_DIR = "processed_samples"

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def extract_and_visualize(zip_path):
    """
    Extracts a sample image and its JSON annotation from the zip file
    and creates a PNG visualization.
    """
    safe_zip_path = zip_path.encode('ascii', 'replace').decode('ascii')
    print(f"Processing {safe_zip_path}...")
    try:
        with zipfile.ZipFile(os.path.join(BASE_DIR, zip_path), 'r') as z:
            file_list = z.namelist()
            
            # Find a pair of image and json
            images = [f for f in file_list if f.lower().endswith(('.png', '.jpg'))]
            jsons = [f for f in file_list if f.lower().endswith('.json')]
            
            pair_found = False
            # Check first 100 images to find a match
            for img_file in images[:100]: 
                base_name = os.path.splitext(os.path.basename(img_file))[0]
                
                # Look for corresponding json
                matching_jsons = [j for j in jsons if base_name in os.path.basename(j)]
                
                if matching_jsons:
                    json_file = matching_jsons[0]
                    print(f"  Found pair: {img_file} <-> {json_file}")
                    
                    # Read Image Data
                    with z.open(img_file) as img_f:
                        img_data = img_f.read()
                        image = Image.open(io.BytesIO(img_data)).convert("RGBA")
                        
                    # Read JSON Data
                    with z.open(json_file) as json_f:
                        annotation_data = json.load(json_f)
                        
                    # Create Visualization
                    create_png_visualization(image, annotation_data, base_name, zip_path)
                    pair_found = True
                    break 
            
            if not pair_found:
                print(f"  No matching image-json pair found in the first 100 images of {zip_path}")

    except Exception as e:
        print(f"  Error processing {zip_path}: {e}")

def create_png_visualization(image, annotation, base_name, source_zip):
    """
    Draws bounding boxes on the image and saves as PNG.
    """
    draw = ImageDraw.Draw(image)
    objects_found = 0
    
    # Logic to extract bounding boxes
    if "annotations" in annotation:
        for ann in annotation["annotations"]:
            bbox = None
            category = "Object"
            
            if "bbox" in ann:
                # [x, y, w, h]
                bbox = ann["bbox"]
            elif "points" in ann and ann.get("type") == "bbox":
                # Points format: [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]
                pts = ann["points"]
                xs = [p[0] for p in pts]
                ys = [p[1] for p in pts]
                min_x = min(xs)
                min_y = min(ys)
                w = max(xs) - min_x
                h = max(ys) - min_y
                bbox = [min_x, min_y, w, h]
                
            if "category_id" in ann:
                category = f"ID: {ann['category_id']}"
            elif "label" in ann:
                category = ann["label"]
            elif "attributes" in ann and ann["attributes"]:
                category = list(ann["attributes"].values())[0]
                
            if bbox:
                # Draw box
                # bbox is [x, y, w, h], PIL needs [x1, y1, x2, y2]
                x, y, w, h = bbox
                draw.rectangle([x, y, x+w, y+h], outline="red", width=3)
                draw.text((x, y-10), category, fill="red")
                objects_found += 1
                
    output_filename = os.path.join(OUTPUT_DIR, f"{base_name}_vis.png")
    image.save(output_filename)
        
    print(f"  Saved visualization to {output_filename}")
    print(f"  Objects overlaid: {objects_found}")

if __name__ == "__main__":
    print("Starting Week 1 Data Processing (PNG Mode)...")
    for zip_file in ZIP_FILES:
        extract_and_visualize(zip_file)
    print("Processing complete.")
