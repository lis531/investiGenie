from api_data import get_api_data
from csv_data import  get_csv_data

# selected by user in the future:
SYMBOL:str = "IBM"

# PATH:str = 'toy_s&p500.csv' #change default period in csv_data
path:str = 'full_s&p500.csv' #toogle this

def get_data(src:str = "api"):
    if src == "api":
        get_api_data(1, SYMBOL)
        path = "stock_data.csv"
    return get_csv_data(path)


# data = get_data("csv")
data = get_data("api")

if data is not None:
    print(data)
else:
    print("Failed to retrieve data.")
