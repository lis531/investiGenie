# backend/algorithms.py
def algorithm_decorator(func):
    def wrapper(prices):
        quantity = 0
        cash = 0
        transaction_days = []
        result = func(prices, quantity, cash, transaction_days)
        return result
    return wrapper

def buy(cash, quantity, price, days_bought, i):
    cash -= price
    quantity += 1
    days_bought.append(i)
    cash = round(cash, 2)
    return quantity, cash, days_bought

def sell(cash, quantity, price, days_sold, i):
    cash += price
    quantity -= 1
    days_sold.append(i)
    cash = round(cash, 2)
    return quantity, cash, days_sold

@algorithm_decorator
def buy_everyday(prices, quantity, cash, transaction_days):
    for i, price in enumerate(prices):
        quantity, cash, transaction_days = buy(cash, quantity, price, transaction_days, i)
    return cash, quantity, transaction_days

@algorithm_decorator
def buy_after_3_consecutive_down_days(prices, quantity, cash, transaction_days):
    for i, price in enumerate(prices[3:]):
        three_days_ago = prices[i - 3]
        two_days_ago = prices[i - 2]
        yesterday = prices[i - 1]
        if three_days_ago > two_days_ago > yesterday > price:
            quantity, cash, transaction_days = buy(cash, quantity, price, transaction_days, i)
    return cash, quantity, transaction_days