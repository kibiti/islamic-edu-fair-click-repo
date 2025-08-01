# Islamic Education Fair Click Repo

A ready-to-use, extensible repository for managing, contacting, and integrating Islamic institutions and schools for education events. Features include WhatsApp messaging, email automation, booth map generation, event scheduling, and USSD registration.

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
