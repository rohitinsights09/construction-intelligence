import os

# Create the full CSV file
target_path = os.path.join(os.getcwd(), 'public', 'data', 'bim_construction_dataset.csv')
os.makedirs(os.path.dirname(target_path), exist_ok=True)

# Let's verify we have the full dataset
print(f"Writing to {target_path}")
