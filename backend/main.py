from api_data import get_api_data
from csv_data import  get_csv_data

# selected by user in the future:
INTERVAL = "30min"
SYMBOL = "IBM"
FUNCTION = "TIME_SERIES_INTRADAY"
MONTH="2009-01"
AVG = True

PATH = 'toy_s&p500.csv'
# PATH = 'full_s&p500.csv' #toogle this

def get_data(src = "api"):
    if src == "api":
        return get_api_data(FUNCTION, SYMBOL, INTERVAL, MONTH, AVG)
    if src == "csv":
        return get_csv_data(PATH)

    else:
        raise Exception("Unknown data source")

data = get_data("api")

if data is not None:
    print(data)
else:
    print("Failed to retrieve data.")
