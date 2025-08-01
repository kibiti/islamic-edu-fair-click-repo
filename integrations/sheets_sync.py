import csv
import sys
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def sync_contacts_to_sheet(csv_file, sheet_name, creds_json):
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name(creds_json, scope)
    client = gspread.authorize(creds)

    # Create new sheet or open existing
    sh = client.create(sheet_name)
    worksheet = sh.sheet1

    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            worksheet.insert_row(row, index=i+1)
    print(f"Synced contacts from {csv_file} to Google Sheet: {sheet_name}")

if __name__ == "__main__":
    # Usage: python sheets_sync.py contacts/institutions.csv "Sheet Name" creds.json
    if len(sys.argv) < 4:
        print("Usage: python sheets_sync.py [csv_file] [sheet_name] [creds_json]")
        sys.exit(1)
    sync_contacts_to_sheet(sys.argv[1], sys.argv[2], sys.argv[3])
