from operator import index

import requests
API_KEY = "71T0T8IRQVS2M3Y2"

functions = ["TIME_SERIES_INTRADAY", "TIME_SERIES_DAILY", "TIME_SERIES_WEEKLY", "TIME_SERIES_MONTHLY"]
intervals = ["1min", "5min", "15min", "30min", "60min"]
#only intraday requires intervals.
#all functions return historical data except intraday, which returns only 1 month

def get_api_data(function_index:int, symbol:str, interval_index:int = 4):
    function = functions[function_index]
    interval = intervals[interval_index]
    url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&outputsize=full&datatype=csv&apikey={API_KEY}" if function_index else f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&interval={interval}&outputsize=full&datatype=csv&apikey={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        # print(response.text)
        with open("stock_data.csv", "w", newline='') as f:
            f.write(response.text)
    else:
        return None

get_api_data(1, "IBM")
