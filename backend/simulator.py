from datetime import datetime
from random import randint
import time


from csv_data import get_csv_data
from plots import stock_plot
from plots import algorithm_plot

import algorithms


def simulate(algorithm=algorithms.buy_everyday, stock='full_s&p500.csv'):
    start_time = time.time()  # Start the timer
    results = {}
    data = get_csv_data(stock)
    for i in range(10, int(round(len(data) * 0.9, 0)) , 10):
        if i > 100 and i % 50 != 0:
            continue
        if i > 300 and i % 100 != 0:
            continue
        if i > 1000 and i % 200 !=0:
            continue
        result = []
        for j in range((len(data) - i)):
            start = j
            prices = [float(e[1]) for e in reversed(data[start : start + i])]
            # dates = [datetime.strptime(e[0], "%m/%d/%Y") for e in reversed(data)]
            # show_plot(prices, dates)
            cash, quantity, days_bought = algorithm(prices)
            stock_value = prices[-1] * quantity
            profit = round(stock_value + cash, 2)
            # result.append({"profit" : profit, "quantity" : quantity, "stock_value" : stock_value, "cash" : cash})
            result.append(profit)
        results[i] = round(sum(result) / len(result), 2)

    end_time = time.time()  # End the timer
    print(f"Function execution time: {end_time - start_time:.2f} seconds")
    # return round(cash, 2), round(stock_value, 2), quantity, profit
    algorithm_plot(results)
    return results
# print(simulate(algorithms.buy_after_3_consecutive_down_days))
simulate(algorithms.buy_after_3_consecutive_down_days)
simulate()
# print(simulate())