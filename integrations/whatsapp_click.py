import csv
import sys
import webbrowser

def send_whatsapp_bulk(csv_file, message):
    """
    Generates WhatsApp click-to-chat links for all WhatsApp numbers in the CSV.
    Opens them in the browser for easy messaging.
    """
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            whatsapp = row.get("WhatsApp")
            name = row.get("Institution", row.get("School", "Contact"))
            if whatsapp and whatsapp.startswith("+254"):
                url = f"https://wa.me/{whatsapp.replace('+', '')}?text={message.replace(' ', '%20')}"
                print(f"Messaging {name}: {url}")
                # Uncomment the next line to actually open browser
                # webbrowser.open(url)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python whatsapp_click.py [csv_file] [message]")
        sys.exit(1)
    send_whatsapp_bulk(sys.argv[1], sys.argv[2])
