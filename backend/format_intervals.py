import csv
from datetime import datetime, timedelta

all_data = []
with open('full_s&p500.csv', 'r') as file:
    reader = csv.reader(file)
    header = next(reader)
    
    for row in reader:
        date_str = row[0].strip('"')
        date_obj = datetime.strptime(date_str, '%m/%d/%Y')
        all_data.append((date_obj, row))

all_data.sort(key=lambda x: x[0], reverse=True)

latest_date = all_data[0][0]
print(f"Latest date in data: {latest_date.strftime('%Y-%m-%d')}")

def create_last_period_data(days, filename, period_name):
    cutoff_date = latest_date - timedelta(days=days-1)
    
    filtered_data = []
    for date_obj, row in all_data:
        if date_obj >= cutoff_date:
            filtered_data.append(row)
    
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(filtered_data)
    
    print(f"{filename} created! Last {period_name}: {len(filtered_data)} records")

create_last_period_data(1, 'last_day.csv', '1 day')
create_last_period_data(7, 'last_week.csv', '1 week') 
create_last_period_data(30, 'last_month.csv', '1 month')
create_last_period_data(365, 'last_year.csv', '1 year')

print("All files created successfully!")