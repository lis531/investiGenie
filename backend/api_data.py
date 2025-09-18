import requests
API_KEY = "71T0T8IRQVS2M3Y2"

def get_api_data(function:str, symbol:str, interval:str, month:str, avg:bool = False):
    url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&interval={interval}&outputsize=full&month={month}&apikey={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'Error Message' in data.keys():
            return data["Error Message"]
        opens = []
        for e in data[f"Time Series ({interval})"]:
            opens.append(float(data[f"Time Series ({interval})"][e]["1. open"]))
        result_avg = f"{symbol} average price in {month} is {round(sum(opens) / len(opens), 2)}"
        result_full = f"{symbol} prices every {interval} in {month}: {opens}"

        return result_avg if avg else result_full
    else:
        return None
