import csv
from datetime import datetime

def get_csv_data(path: str, period=('01/01/2000', '12/31/2018')):
    start_date = datetime.strptime(period[0], "%m/%d/%Y")
    end_date = datetime.strptime(period[1], "%m/%d/%Y")
    result = []

    with open(path, newline='') as file:
        reader = csv.reader(file)
        for row in reader:
            try:
                row_date = datetime.strptime(row[0], "%m/%d/%Y")
                if start_date <= row_date <= end_date:
                    result.append(row)
            except ValueError:
                continue

    return result