from csv_data import  get_csv_data
import algorithms

def simulate(algorithm=algorithms.buy_everyday, start_cash = 100000, stock='full_s&p500.csv', monthly_cash = 1000):
    data = get_csv_data(stock)
    results = {}
    for i in range(10, int(round(len(data) * 0.9, 0)), 10):
        if i > 100 and i % 50 != 0:
            continue
        if i > 300 and i % 100 != 0:
            continue
        if i > 1000 and i % 200 != 0:
            continue
        result = []
        for j in range((len(data) - i)):
            start = j
            prices = [float(e[1]) for e in reversed(data[start : start + i])]
            cash, quantity, total_cash = algorithm(prices, start_cash, monthly_cash)
            stock_value = prices[-1] * quantity
            profit = round((stock_value + cash - total_cash)/total_cash * 100, 2)
            result.append(profit)
        results[i] = round(sum(result) / len(result), 2)
    return results

print(simulate(algorithms.buy_after_3_consecutive_down_days))
print(simulate())