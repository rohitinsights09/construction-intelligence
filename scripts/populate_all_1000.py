import os

# We will generate the 1000 rows from the provided dataset schema and deterministic dataset
output_file = "public/data/bim_construction_dataset.csv"
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Let's inspect writing the CSV
print("Populating CSV...")
