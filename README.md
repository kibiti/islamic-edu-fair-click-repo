# Islamic Education Fair Click Repo
## Repo Structure
```txt
islamic-edu-fair-click-repo/
|
├── contacts/
│   ├── institutions.csv
│   ├── schools.csv
│   └── contacts_template.csv
│
├── integrations/
│   ├── whatsapp_click.py
│   ├── email_sender.py
│   ├── booth_map.py
│   ├── event_schedule.py
│   └── ussd_registration.py
│
├── README.md
│
└── templates/
    ├── university_invitation.txt
    ├── sponsor_proposal.txt
    ├── school_invitation.txt
    └── media_partnership.txt
```

A ready-to-use, extensible repository for managing, contacting, and integrating Islamic institutions and schools for education events. Features include WhatsApp messaging, email automation, booth map generation, event scheduling, and USSD registration.

## USSD Registration Integration

The repo includes a backend for USSD event registration (*386*55#).  
To run the backend locally:

```bash
cd backend
npm install express body-parser
node server.js
```

- **/ussd/africastalking**: Africa's Talking webhook endpoint  
- **/ussd/generic**: Generic endpoint for other gateways

Configure your USSD gateway to POST requests to your server’s public URL.

## Features

- CSV directory of all institutions and schools (with WhatsApp, emails, map locations)
- WhatsApp click-to-message integration
- Automated email sender
- Event booth map generator
- Schedules and reminders integration
- USSD registration stub (replace with your provider)
- Email and WhatsApp templates for invitations

## Usage

- Replace sample contact details in `contacts/` with real data.
- Customize templates in `templates/` for your event.
- Integrate and run scripts in `integrations/` for messaging, mapping, scheduling, and registration.

## Quick Start

```bash
# Example: Send WhatsApp invites to all contacts
python integrations/whatsapp_click.py contacts/institutions.csv "Welcome to the Kenya Islamic Education Fair!"

# Example: Generate booth map
python integrations/booth_map.py contacts/institutions.csv

# Example: Send bulk emails
python integrations/email_sender.py contacts/institutions.csv templates/university_invitation.txt

# Example: Register via USSD (simulation)
python integrations/ussd_registration.py "+254731838387"
```

## Folder Structure

- `contacts/` - CSV files for institutions and schools
- `integrations/` - Python scripts for messaging, mapping, scheduling, registration
- `templates/` - Invitation and proposal templates

---

**Replace contacts and template text with your event-specific information.**
