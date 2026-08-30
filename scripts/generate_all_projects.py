import sys
import os

# We will write the full CSV to public/data/bim_construction_dataset.csv and src/data/defaultCsvText.ts
# Let's inspect the target location
csv_path = "public/data/bim_construction_dataset.csv"
os.makedirs(os.path.dirname(csv_path), exist_ok=True)
print("Ready to write full CSV")
