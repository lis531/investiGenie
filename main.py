from api_data import get_api_data
from csv_data import  get_csv_data

def get_data(src="api"):
    if src == "api":
       return get_api_data(function, symbol, interval, month, avg)
    if src == "csv":
        return get_csv_data(path)
    else:
        raise Exception("Unknown data source")

#selected by user in the future:
interval = "30min"
symbol = "IBM"
function = "TIME_SERIES_INTRADAY"
month="2009-01"
avg = True

path = 'toy_s&p500.csv'
# path = 'full_s&p500.csv' #toogle this

data = get_data("api")

if data is not None:
    print(data)
else:
    print("Failed to retrieve data.")
