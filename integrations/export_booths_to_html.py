import csv
import sys

def parse_coords(location_url):
    """
    Extracts latitude and longitude from a Google Maps URL if present.
    Accepts URLs like:
        https://maps.app.goo.gl/UmmaUni
        https://www.google.com/maps/place/.../@lat,lng,...
    Returns (lat, lng) or (None, None).
    """
    import re
    if not location_url:
        return None, None
    # Try to extract from /@lat,lng in URL
    match = re.search(r'/@([-\d\.]+),([-\d\.]+)', location_url)
    if match:
        return float(match.group(1)), float(match.group(2))
    # Try to extract from q=lat,lng or ll=lat,lng
    match = re.search(r'[?&](q|ll)=([-\d\.]+),([-\d\.]+)', location_url)
    if match:
        return float(match.group(2)), float(match.group(3))
    # Fallback: None
    return None, None

def export_booths(csv_file, html_file):
    booths = []
    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get("Institution") or row.get("School") or row.get("Name", "Booth")
            location = row.get("Map Location", "")
            website = row.get("Website", "")
            lat, lng = parse_coords(location)
            # If lat/lng not found, skip booth (or set default coordinates)
            if lat is not None and lng is not None:
                booths.append({'name': name, 'lat': lat, 'lng': lng, 'link': website})
    # Generate JS array
    booths_js = "[\n" + ",\n".join([
        f'  {{name: "{b["name"]}", lat: {b["lat"]}, lng: {b["lng"]}, link: "{b["link"]}"}}'
        for b in booths
    ]) + "\n]"
    # Write HTML file
    with open(html_file, 'w', encoding='utf-8') as out:
        out.write(f'''<!DOCTYPE html>
<html>
<head>
    <title>Islamic Edu Fair Booth Map</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>#map {{ height: 600px; }}</style>
</head>
<body>
<h2>Interactive Booth Map</h2>
<div id="map"></div>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
var map = L.map('map').setView([-1.286389, 36.817223], 12);
L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
    attribution: '© OpenStreetMap contributors'
}}).addTo(map);

var booths = {booths_js};
booths.forEach(function(booth, idx){{
   var marker = L.marker([booth.lat, booth.lng]).addTo(map);
   marker.bindPopup('<b>' + booth.name + '</b><br/><a href="' + booth.link + '" target="_blank">Website</a>');
}});
</script>
</body>
</html>
''')
    print(f"Booth map exported to {html_file} with {len(booths)} booths.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python export_booths_to_html.py [csv_file] [output_html]")
        sys.exit(1)
    export_booths(sys.argv[1], sys.argv[2])
