import sys

def ussd_register(phone):
    """
    Simulates USSD code registration. Replace with API for actual provider integration.
    """
    ussd_code = "*38655#"
    print(f"To register, dial {ussd_code} on your phone ({phone}).")
    print("Registration instructions sent.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ussd_registration.py [phone_number]")
        sys.exit(1)
    ussd_register(sys.argv[1])
