import csv
import sys
from twilio.rest import Client

def send_bulk_sms(csv_file, message, sid, token, from_num):
    client = Client(sid, token)
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            phone = row.get("Phone") or row.get("WhatsApp")
            name = row.get("Institution", row.get("School", "Contact"))
            if phone and phone.startswith("+254"):
                try:
                    client.messages.create(
                        body=message,
                        from_=from_num,
                        to=phone
                    )
                    print(f"SMS sent to {name} at {phone}")
                except Exception as e:
                    print(f"Failed to send to {name}: {e}")

if __name__ == "__main__":
    # Usage: python sms_sender.py contacts/institutions.csv "Message" TWILIO_SID TWILIO_TOKEN FROM_NUMBER
    if len(sys.argv) < 6:
        print("Usage: python sms_sender.py [csv_file] [message] [sid] [token] [from_number]")
        sys.exit(1)
    send_bulk_sms(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
