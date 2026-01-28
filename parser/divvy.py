import sys
import csv
from bs4 import BeautifulSoup

html_file = sys.argv[1]
csv_file = "output.csv"

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

headers = ['Date', 'Start station', 'Start time', 'End station', 'End time']
# Open the CSV file for writing
with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    # Extract headers
    writer.writerow(headers)

    divvy_trips = soup.select('div[class*="Components__Wrapper"]')

    print(f"Data elements count:'{len(divvy_trips)}'")

    if not divvy_trips:
        print(f"Fields not found in {html_file}")
        sys.exit(1)

    for trip in divvy_trips:

        # NON NESTED
        # date      sc-cx1xxi-0 eOzbdu
        date_list = trip.find('h2', class_='sc-cx1xxi-0 eOzbdu').get_text().splitlines()
        date = date_list[0].strip()
        if len(date_list) > 1:
            date += " " + date_list[1].strip()
        print(date)

        start_station = ""
        start_time = ""
        end_station = ""
        end_time = ""

        # NESTED
        # start     Components__Start-sc-1yewqdd-0 bSShsJ
        start = trip.find('div', class_='Components__Start-sc-1yewqdd-0 bSShsJ')
        
        # TODO - skip and mark if no start/end
        if start:
            # .station  sc-cx1xxi-0 bRSchk
            start_station = start.find('div', class_='sc-cx1xxi-0 bRSchk').get_text().splitlines()[0]
            print(start_station)
            # .time     Components__TextMuted-sc-19oq86k-0 bepYxb
            start_time = start.find('div', class_='Components__TextMuted-sc-19oq86k-0 bepYxb').get_text()
            print(start_time)


            # end       Components__End-sc-1yewqdd-1 dUHFFN
            end = trip.find('div', class_='Components__End-sc-1yewqdd-1 dUHFFN')
            if end:
                # .station  sc-cx1xxi-0 bRSchk
                end_station = end.find('div', class_='sc-cx1xxi-0 bRSchk').get_text().splitlines()[0]
                print(end_station)

                # .time     Components__TextMuted-sc-19oq86k-0 bepYxb
                end_time = end.find('div', class_='Components__TextMuted-sc-19oq86k-0 bepYxb').get_text()
                print(end_time)

        if not start:
            print(f"Start/End not found for {date}. Skipping")

        data_row = [date, start_station, start_time, end_station, end_time]
        print(data_row)

        writer.writerow(data_row)


print(f"Successfully run")
