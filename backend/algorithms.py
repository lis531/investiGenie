def buy(cash, quantity, price):
    if cash >= price:
        cash -= price
        quantity += 1
    return quantity, cash

def sell(cash, quantity, price, days_sold):
    if quantity >= 1:
        cash += price
        quantity -= 1
    return quantity, cash, days_sold

def buy_everyday(prices, cash, monthly_cash):
    quantity = 0
    total_cash = cash
    for i, price in enumerate(prices):
        if i % 21 == 0:
            cash += monthly_cash
            total_cash += monthly_cash
        quantity, cash = buy(cash, quantity, price)
    return cash, quantity, total_cash

def buy_after_3_consecutive_down_days(prices, cash, monthly_cash):
    quantity = 0
    total_cash = cash
    for i, price in enumerate(prices[3:]):
        if i % 21 == 0:
            cash += monthly_cash
            total_cash += monthly_cash
        three_days_ago = prices[i - 3]
        two_days_ago = prices[i - 2]
        yesterday = prices[i - 1]
        if three_days_ago > two_days_ago > yesterday > price:
            for i in range(1, round(monthly_cash/price)):
                quantity, cash = buy(cash, quantity, price)
    return cash, quantity, total_cash