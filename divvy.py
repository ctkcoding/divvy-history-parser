import sys
import csv
import html_to_json
import json
from bs4 import BeautifulSoup

html_file = sys.argv[1]
csv_file = "outputs/{html_file}.csv"

# with open(html_file, 'r', encoding='utf-8') as f:
#     html_string = f.read()

# TODO - initial parsing of entire file
# output_json_dict = html_to_json.convert(html_string)
# json_string = json.dumps(output_json_dict, indent=4)

# print(json_string)



# TODO - every field i want
# price? basically useless, most are free
# duration? compute from start and end time

# date      sc-cx1xxi-0 eOzbdu

# start     Components__Start-sc-1yewqdd-0 bSShsJ
# .station  sc-cx1xxi-0 bRSchk
# .time     Components__TextMuted-sc-19oq86k-0 bepYxb

# end       Components__End-sc-1yewqdd-1 dUHFFN
# .station  sc-cx1xxi-0 bRSchk
# .time     Components__TextMuted-sc-19oq86k-0 bepYxb

with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find the specific table you want to extract (adjust selectors as needed)
divvy_trips = soup.select('div[class*="Components__Wrapper"]')

print(f"Data elements count:'{len(divvy_trips)}'")

if not divvy_trips:
    print(f"Fields not found in {html_file}")
    sys.exit(1)

for trip in divvy_trips:

    # NON NESTED
    # date      sc-cx1xxi-0 eOzbdu
    date = trip.find('h2', class_='sc-cx1xxi-0 eOzbdu').text
    print(date)

    # TODO - skip and mark if no start/end

    # NESTED
    # start     Components__Start-sc-1yewqdd-0 bSShsJ
    start = trip.find('div', class_='Components__Start-sc-1yewqdd-0 bSShsJ')
    # .station  sc-cx1xxi-0 bRSchk
    start_station   = start.find('div', class_='sc-cx1xxi-0 bRSchk').text
    print(start_station)
    # .time     Components__TextMuted-sc-19oq86k-0 bepYxb
    start_time      = start.find('div', class_='Components__TextMuted-sc-19oq86k-0 bepYxb').text
    print(start_time)


    # end       Components__End-sc-1yewqdd-1 dUHFFN
    end = trip.find('div', class_='Components__End-sc-1yewqdd-1 dUHFFN')
    # .station  sc-cx1xxi-0 bRSchk
    end_station = trip.find('div', class_='sc-cx1xxi-0 bRSchk').text
    print(end_station)
    # .time     Components__TextMuted-sc-19oq86k-0 bepYxb
    end_time = trip.find('div', class_='Components__TextMuted-sc-19oq86k-0 bepYxb').text
    print(end_time)

    # output_json_dict = html_to_json.convert(trip.get_text)
    # json_string = json.dumps(output_json_dict, indent=4)
    # print(json_string)
    # print(f"Data:'{trip.get_text}'")

# # Open the CSV file for writing
# with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
#     writer = csv.writer(csvfile)
    
#     # Extract headers
#     headers = [header.get_text(strip=True) for header in table.find_all('th')]
#     writer.writerow(headers)
    
#     # Extract data rows
#     for row in table.find_all('tr')[1:]: # Skip the header row
#         csv_row = [cell.get_text(strip=True) for cell in row.find_all('td')]
#         if csv_row: # Ensure the row is not empty
#             writer.writerow(csv_row)

print(f"Successfully run")
