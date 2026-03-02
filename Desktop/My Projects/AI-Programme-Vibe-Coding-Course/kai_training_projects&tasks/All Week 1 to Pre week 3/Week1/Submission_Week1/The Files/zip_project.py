import zipfile
import os
import shutil

# Files to include in the submission
files_to_zip = [
    "README.md",
    "process_week1_data.py",
    "vibe_logic_demo.py"
]

# Folders to include (and their contents)
folders_to_zip = [
    "processed_samples"
]

# External files (Artifacts) we want to include
# Copy them locally first
artifact_path = r"C:\Users\M I C R O S P A C E\.gemini\antigravity\brain\e741b913-4f98-41e4-9cfb-2597aae8d50c\kai_bridge_report.md"
local_report = "kai_bridge_report.md"

try:
    shutil.copy(artifact_path, local_report)
    files_to_zip.append(local_report)
    print(f"Copied report: {local_report}")
except Exception as e:
    print(f"Warning: Could not copy report: {e}")

output_zip = "Week1_Project_Audit.zip"

print(f"Creating {output_zip}...")
try:
    with zipfile.ZipFile(output_zip, 'w') as z:
        for file in files_to_zip:
            if os.path.exists(file):
                print(f"  Adding {file}")
                z.write(file)
            else:
                print(f"  Warning: {file} not found")
        
        for folder in folders_to_zip:
            if os.path.exists(folder):
                print(f"  Adding folder {folder}")
                for root, dirs, files in os.walk(folder):
                    for file in files:
                        file_path = os.path.join(root, file)
                        z.write(file_path, os.path.join(folder, file))
            else:
                print(f"  Warning: Folder {folder} not found")
                
    print("Zip created successfully.")
except Exception as e:
    print(f"Error creating zip: {e}")
