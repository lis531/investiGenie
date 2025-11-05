from csv_data import get_csv_data
import algorithms

def algorithm_wrapper(prices: list[float], start_cash: float, monthly_cash: float, algorithm=algorithms.buy_one_everyday) -> tuple[float, float, float]:
    """
    Wraps the trading algorithm to simulate stock trading over a given price list.

    Args:
        prices (list[float]): List of stock prices.
        start_cash (float): Initial cash available for trading.
        monthly_cash (float): Cash added to the account every working 21 days.
        algorithm (function, optional): The trading algorithm to use. Defaults to `algorithms.buy_one_everyday`.

    Returns:
        tuple[float, float, float]: Remaining cash, total quantity of stock owned, and total cash invested.
    """
    owned_quantity = 0
    cash = start_cash
    total_cash = start_cash
    for i, price in enumerate(prices):
        if i % 21 == 0:
            cash += monthly_cash
            total_cash += monthly_cash
        order_type, order_quantity = algorithm(i, prices, start_cash, monthly_cash, cash)
        match order_type:
            case "buy":
                owned_quantity, cash = buy(cash, owned_quantity, price, order_quantity)
            case "sell":
                owned_quantity, cash = sell(cash, owned_quantity, price, order_quantity)
            case "none":
                pass
    return cash, owned_quantity, total_cash

def buy(cash: float, owned_quantity: float, price: float, order_quantity: float = 1) -> tuple[float, float]:
    """
    Executes a buy operation for a given order quantity of stock.

    Args:
        cash (float): The available cash.
        owned_quantity (float): The current owned quantity of stock.
        price (float): The price of the stock.
        order_quantity (float, optional): The quantity of stock to buy. Defaults to 1.

    Returns:
        tuple[float, float]: Updated owned quantity of stock and remaining cash.
    """
    if cash >= price * order_quantity:
        cash -= price * order_quantity
        owned_quantity += order_quantity
    return owned_quantity, cash

def sell(cash: float, owned_quantity: float, price: float, order_quantity: float = 1) -> tuple[float, float]:
    """
    Executes a sell operation for a given order quantity of stock.

    Args:
        cash (float): The available cash.
        owned_quantity (float): The current owned quantity of stock.
        price (float): The price of the stock.
        order_quantity (float, optional): The quantity of stock to sell. Defaults to 1.

    Returns:
        tuple[float, float]: Updated owned quantity of stock and remaining cash.
    """
    if owned_quantity >= order_quantity:
        cash += price * order_quantity
        owned_quantity -= order_quantity
    return owned_quantity, cash

def simulate(algorithm=algorithms.buy_one_everyday, start_cash: float = 100000, monthly_cash: float = 1000, stock: str = 'full_s&p500.csv') -> dict[int, float]:
    """
    Simulates the performance of a given stock trading algorithm over historical data.

    Args:
        algorithm (function, optional): The trading algorithm to simulate. Defaults to `algorithms.buy_one_everyday`.
        start_cash (float, optional): The initial cash available for trading. Defaults to 100000.
        monthly_cash (float, optional): The cash added to the account every month. Defaults to 1000.
        stock (str, optional): The path to the CSV file containing historical stock data. Defaults to 'full_s&p500.csv'.

    Returns:
        dict[int, float]: A dictionary where the keys are the number of days in the simulation window, and the values are the average profit percentages.
    """
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
            prices = [float(e[1]) for e in reversed(data[start: start + i])]
            cash, quantity, total_cash = algorithm_wrapper(prices, start_cash, monthly_cash, algorithm)
            stock_value = prices[-1] * quantity
            profit = round((stock_value + cash - total_cash) / total_cash * 100, 2)
            result.append(profit)
        results[i] = round(sum(result) / len(result), 2)
    return results

print(simulate(algorithms.buy_after_3_consecutive_down_days))
print(simulate())