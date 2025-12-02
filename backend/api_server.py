from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from api_data import get_api_data
from csv_data import get_csv_data
import os
from typing import List, Dict, Any
import algorithms

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default to S&P 500 Index
SYMBOL = "^GSPC"

def calculate_date_range(range_type: str) -> tuple:
    """Calculate start and end dates - get enough data to filter later"""
    end_date = datetime.now()
    
    if range_type == "1d":
        start_date = end_date - timedelta(days=5)
    elif range_type == "1w":
        start_date = end_date - timedelta(days=20)
    elif range_type == "1m":
        start_date = end_date - timedelta(days=50)
    elif range_type == "1y":
        start_date = end_date - timedelta(days=500)
    else:
        start_date = end_date - timedelta(days=5)
    
    return (
        start_date.strftime("%m/%d/%Y"),
        end_date.strftime("%m/%d/%Y")
    )

def get_function_index_for_range(range_type: str) -> int:
    """Determine which API function to use based on range"""
    if range_type == "1d":
        return 0  # TIME_SERIES_INTRADAY
    elif range_type == "1w" or range_type == "1m" or range_type == "1y":
        return 1  # TIME_SERIES_DAILY
    else:
        return 1  # Default to DAILY

def parse_stock_data(csv_data: List[List[str]], include_time: bool = False) -> List[Dict[str, Any]]:
    """Parse CSV data into JSON format for frontend"""
    result = []
    
    for row in csv_data:
        if len(row) < 6:
            continue
        
        try:
            date_str = row[0].strip()
            
            # Skip header row
            if date_str.lower() in ['timestamp', 'date']:
                continue
            
            # parse the date
            date_obj = None
            has_time = False
            for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%Y-%d-%m"]:
                try:
                    date_obj = datetime.strptime(date_str, fmt)
                    if fmt == "%Y-%m-%d %H:%M:%S":
                        has_time = True
                    break
                except ValueError:
                    continue
            
            if date_obj is None:
                print(f"Could not parse date: {date_str}")
                continue
            
            # Format date with time if include_time is True and time exists
            if include_time and has_time:
                formatted_date = date_obj.strftime("%Y-%m-%d %H:%M:%S")
            else:
                formatted_date = date_obj.strftime("%Y-%m-%d")
            
            # Alpha Vantage format: timestamp,open,high,low,close,volume
            # row[1]=open, row[4]=close
            open_price = float(row[1])
            high_price = float(row[2]) if len(row) > 2 else open_price
            low_price = float(row[3]) if len(row) > 3 else open_price
            close_price = float(row[4])
            
            # Skip rows with invalid/zero prices
            if open_price <= 0 or high_price <= 0 or low_price <= 0 or close_price <= 0:
                print(f"Skipping row with invalid prices: {row}")
                continue
            
            if open_price > 0:
                change = ((close_price - open_price) / open_price) * 100
                change_str = f"{change:+.2f}%"
            else:
                change_str = "0.00%"
            
            result.append({
                "date": formatted_date,
                "price": close_price,
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "volume": row[5] if len(row) > 5 else "0",
                "change": change_str,
                "file_name": "api"
            })
        except (ValueError, IndexError) as e:
            print(f"Error parsing row {row}: {e}")
            continue
    
    return result

@app.get("/api/stock-data")
async def get_stock_data(range: str = "1d", symbol: str = "^GSPC"):
    """
    Fetch stock data for the specified time range
    
    Parameters:
    - range: Time range (1d, 1w, 1m, 1y)
    - symbol: Stock symbol (default: ^GSPC for S&P 500)
    """
    try:
        # Get the appropriate function index based on range
        function_index = get_function_index_for_range(range)
        
        # Fetch data from API (use higher-resolution intraday for 1d)
        print(f"Fetching data for {symbol} with range {range}")
        if range == "1d":
            # Try 1-minute granularity first; some symbols (indexes) may not support it
            get_api_data(function_index, symbol, interval_index=0)
        else:
            get_api_data(function_index, symbol)
        
        # Check if the data file was created
        if not os.path.exists("stock_data.csv"):
            raise HTTPException(status_code=500, detail="Failed to fetch data from API")
        
        # Read the CSV file directly
        import csv
        csv_data = []
        with open("stock_data.csv", "r") as f:
            reader = csv.reader(f)
            for row in reader:
                csv_data.append(row)
        
        if len(csv_data) <= 1:  # Only header or empty
            raise HTTPException(status_code=404, detail="No data found in API response")
        
        # Parse the data into JSON format (include time for intraday)
        include_time = (range == "1d")
        stock_data = parse_stock_data(csv_data, include_time)
        
        if not stock_data:
            raise HTTPException(status_code=404, detail="No data found after parsing")
        
        # Sort data by date (newest first)
        stock_data.sort(key=lambda x: datetime.strptime(
            x["date"], 
            "%Y-%m-%d %H:%M:%S" if " " in x["date"] else "%Y-%m-%d"
        ), reverse=True)
        
        # For daily data, we need to get unique dates first, then take last N days
        if not include_time and range in ["1w", "1m", "1y"]:
            # Group by unique dates
            unique_dates = []
            dates_seen = set()
            
            for item in stock_data:
                date_only = item["date"].split()[0] if " " in item["date"] else item["date"]
                if date_only not in dates_seen:
                    unique_dates.append(date_only)
                    dates_seen.add(date_only)
            
            # Determine how many unique days we need
            days_needed = {
                "1w": 7,
                "1m": 22,
                "1y": 252
            }.get(range, 7)
            
            # Take only the first N unique dates (most recent)
            selected_dates = set(unique_dates[:days_needed])
            
            # Filter data to only include these dates
            filtered_data = [
                item for item in stock_data 
                if (item["date"].split()[0] if " " in item["date"] else item["date"]) in selected_dates
            ]
        elif include_time:
            # For intraday (1d), get all data from the most recent trading day
            if stock_data:
                most_recent_date = stock_data[0]["date"].split()[0]
                filtered_data = [item for item in stock_data if item["date"].startswith(most_recent_date)]
            else:
                filtered_data = []
            # If too few points (e.g., only hourly), fallback to 5m and refetch
            if len(filtered_data) < 30:
                get_api_data(function_index, symbol, interval_index=1)
                # reload csv and reparse
                import csv
                csv_data = []
                with open("stock_data.csv", "r") as f:
                    reader = csv.reader(f)
                    for row in reader:
                        csv_data.append(row)
                stock_data = parse_stock_data(csv_data, include_time)
                if stock_data:
                    stock_data.sort(key=lambda x: datetime.strptime(
                        x["date"], 
                        "%Y-%m-%d %H:%M:%S" if " " in x["date"] else "%Y-%m-%d"
                    ), reverse=True)
                    most_recent_date = stock_data[0]["date"].split()[0]
                    filtered_data = [item for item in stock_data if item["date"].startswith(most_recent_date)]
        else:
            filtered_data = stock_data
        
        # Sort back to chronological order (oldest first for chart display)
        filtered_data.sort(key=lambda x: datetime.strptime(
            x["date"], 
            "%Y-%m-%d %H:%M:%S" if " " in x["date"] else "%Y-%m-%d"
        ))
        
        return {
            "success": True,
            "data": filtered_data,
            "range": range,
            "symbol": symbol
        }
        
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Strategy simulation moved to frontend - this endpoint is no longer needed

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
