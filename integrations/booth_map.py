import csv
import sys

def generate_booth_map(csv_file):
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        booths = []
        for i, row in enumerate(reader, start=1):
            name = row.get("Institution", row.get("School", "Contact"))
            location = row.get("Map Location", "Not provided")
            booths.append(f"Booth {i}: {name} - Map: {location}")
        print("\nBooth Map Layout:")
        for booth in booths:
            print(booth)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python booth_map.py [csv_file]")
        sys.exit(1)
    generate_booth_map(sys.argv[1])
