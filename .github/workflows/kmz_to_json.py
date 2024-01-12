import requests
import zipfile
import subprocess
from bs4 import BeautifulSoup
import json

# Download the KMZ file and extract the KML inside
response = requests.get(f"https://data.cityofchicago.org/download/rytz-fq6y/"
                        "application%2Fvnd.google-earth.kmz")
with open('temp.kmz', 'wb') as f:
    f.write(response.content)
kmz = zipfile.ZipFile('temp.kmz', 'r')
kml = kmz.open('doc.kml', 'r').read()
with open('temp.kml', 'wb') as f:
    f.write(kml)

# Use ogr2ogr to convert KML to GeoJSON
subprocess.run(['ogr2ogr', '-f', 'GeoJSON', 'data/map.json', 'temp.kml'])
with open('data/map.json', 'r') as f:
    data = json.load(f)

# Clean the HTML from the 'description' field
for feature in data['features']:
    soup = BeautifulSoup(feature['properties']['description'], 'html.parser')
    feature['properties']['description'] = soup.get_text()

    # After cleaning, each feature's 'properties' field looks like this
    # For now, we want only the 'ROUTE' and 'NAME' properties (case-sensitive)
    #  "Name": "111A",
    #  "description": "a bunch of gibberish",
    #  "altitudeMode": "clampToGround",
    #  "tessellate": 1,
    #  "extrude": 0,
    #  "visibility": -1,
    #  "snippet": "",
    #  "ROUTE": "111A",
    #  "ROUTE0": "111A",
    #  "NAME": "PULLMAN SHUTTLE",
    #  "WKDAY": "1",
    #  "SAT": "1",
    #  "SUN": "1",
    #  "SHAPE.LEN": "19392.594684"
    for table in soup.find_all('table'):
        for row in table.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) == 2:
                prop = cells[0].get_text().strip()
                value = cells[1].get_text().strip()
                if prop in ["ROUTE", "NAME"]:
                    feature['properties'][prop] = value

    # Remove unwanted properties
    unwanted_props = [prop for prop in feature['properties'] if prop not in ["ROUTE", "NAME"]]
    for prop in unwanted_props:
        del feature['properties'][prop]

# Save the cleaned GeoJSON data
with open('data/map.json', 'w') as f:
    json.dump(data, f)
