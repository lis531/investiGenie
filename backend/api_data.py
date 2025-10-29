import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import csv

def get_api_data(function_index: int, symbol: str, interval_index: int = 4):
    """
    Fetch stock data using yfinance (Yahoo Finance API)
    
    function_index:
        0 = Intraday data (1 hour intervals)
        1 = Daily data
        2 = Weekly data
        3 = Monthly data
    
    interval_index (only for intraday):
        0 = 1 minute
        1 = 5 minutes
        2 = 15 minutes
        3 = 30 minutes
        4 = 60 minutes (1 hour)
    """
    
    try:
        ticker = yf.Ticker(symbol)
        
        if function_index == 0:
            # Intraday data - last 7 days with hourly intervals
            interval_map = {
                0: "1m",
                1: "5m",
                2: "15m",
                3: "30m",
                4: "1h"
            }
            interval = interval_map.get(interval_index, "1h")
            period = "7d" if interval in ["1m", "5m", "15m", "30m"] else "60d"
            data = ticker.history(period=period, interval=interval)
            
        elif function_index == 1:
            # Daily data - last 2 years
            data = ticker.history(period="2y", interval="1d")
            
        elif function_index == 2:
            # Weekly data - last 5 years
            data = ticker.history(period="5y", interval="1wk")
            
        elif function_index == 3:
            # Monthly data - last 10 years
            data = ticker.history(period="10y", interval="1mo")
            
        else:
            # Default to daily
            data = ticker.history(period="2y", interval="1d")
        
        if data.empty:
            print(f"No data found for symbol: {symbol}")
            return None
        
        # Reset index to make datetime a column
        data.reset_index(inplace=True)
        
        # Rename columns to match Alpha Vantage format
        if 'Date' in data.columns:
            data.rename(columns={'Date': 'timestamp'}, inplace=True)
        elif 'Datetime' in data.columns:
            data.rename(columns={'Datetime': 'timestamp'}, inplace=True)
        
        # Format timestamp based on whether it's intraday or not
        if function_index == 0:
            # Keep full datetime for intraday
            data['timestamp'] = data['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')
        else:
            # Date only for daily/weekly/monthly
            data['timestamp'] = data['timestamp'].dt.strftime('%Y-%m-%d')
        
        # Rename columns to match expected format
        data.rename(columns={
            'Open': 'open',
            'High': 'high',
            'Low': 'low',
            'Close': 'close',
            'Volume': 'volume'
        }, inplace=True)
        
        # Select only needed columns
        csv_data = data[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
        
        # Write to CSV file
        with open("stock_data.csv", "w", newline='') as f:
            csv_data.to_csv(f, index=False)
        
        print(f"Successfully fetched {len(csv_data)} data points for {symbol}")
        return True
        
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

# Test the function
if __name__ == "__main__":
    get_api_data(1, "^GSPC")  # S&P 500 index
