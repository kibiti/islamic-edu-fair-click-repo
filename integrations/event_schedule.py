import csv
import sys

def build_schedule(csv_file):
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        print("Event Schedule:")
        for i, row in enumerate(reader, start=1):
            name = row.get("Institution", row.get("School", "Contact"))
            print(f"{i}. {name} - Presentation Slot: {10+i}:00 AM - {11+i}:00 AM")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python event_schedule.py [csv_file]")
        sys.exit(1)
    build_schedule(sys.argv[1])
