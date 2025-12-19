import csv
from bs4 import BeautifulSoup

def html_to_csv_manual(html_file, csv_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Find the specific table you want to extract (adjust selectors as needed)
    divvy_trips = soup.select('div[class*="Components__Wrapper"]')


    print(f"Data elements count:'{len(divvy_trips)}'")
    
    if not divvy_trips:
        print(f"Fields not found in {html_file}")
        return

    for trip in divvy_trips:
        print(f"Data:'{trip.get_text}'")

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

    print(f"Successfully converted '{html_file}' to '{csv_file}'")


# Usage:
# html_filename = 'data/24_hist.html'
html_filename = 'data/single.html'
csv_filename = 'output/divvy.csv'
html_to_csv_manual(html_filename, csv_filename)
