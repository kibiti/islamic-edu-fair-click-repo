import csv
import sys
import smtplib
from email.message import EmailMessage

def send_bulk_emails(csv_file, template_file, subject="Invitation to Kenya Islamic Education Fair"):
    with open(template_file, 'r', encoding='utf-8') as tf:
        template = tf.read()
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row.get("Email")
            name = row.get("Institution", row.get("School", "Contact"))
            if email:
                msg = EmailMessage()
                msg["Subject"] = subject
                msg["From"] = "youremail@domain.com"  # Replace with your sender
                msg["To"] = email
                msg.set_content(template.replace("{name}", name))
                print(f"Sending email to {name} at {email}")
                # Uncomment and configure below to send
                # with smtplib.SMTP("smtp.domain.com", 587) as server:
                #     server.starttls()
                #     server.login("username", "password")
                #     server.send_message(msg)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python email_sender.py [csv_file] [template_file]")
        sys.exit(1)
    send_bulk_emails(sys.argv[1], sys.argv[2])
