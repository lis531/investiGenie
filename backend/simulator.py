from datetime import datetime
from csv_data import get_csv_data
from plots import show_plot
import algorithms

def simulate(algorithm=algorithms.buy_everyday, stock='full_s&p500.csv'):
    data = get_csv_data(stock)
    prices = [float(e[1]) for e in reversed(data)]
    dates = [datetime.strptime(e[0], "%m/%d/%Y") for e in reversed(data)]
    show_plot(prices, dates)
    cash, quantity, days_bought = algorithm(prices)
    stock_value = prices[-1] * quantity
    profit = round(stock_value / (-cash) * 100, 2)

    return round(cash, 2), round(stock_value, 2), quantity, profit

print(simulate(algorithms.buy_after_3_consecutive_down_days))
print(simulate())