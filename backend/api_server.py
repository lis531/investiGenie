from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from api_data import get_api_data
from csv_data import get_csv_data
import os
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYMBOL = "IBM"

def calculate_date_range(range_type: str) -> tuple:
    """Calculate start and end dates based on range type"""
    end_date = datetime.now()
    
    if range_type == "1d":
        # Last day - get last trading day
        start_date = end_date - timedelta(days=1)
    elif range_type == "1w":
        # Last week
        start_date = end_date - timedelta(days=7)
    elif range_type == "1m":
        # Last month
        start_date = end_date - timedelta(days=30)
    elif range_type == "1y":
        # Last year
        start_date = end_date - timedelta(days=365)
    else:
        # Default to 1 day
        start_date = end_date - timedelta(days=1)
    
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

def parse_stock_data(csv_data: List[List[str]]) -> List[Dict[str, Any]]:
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
            for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%Y-%d-%m"]:
                try:
                    date_obj = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue
            
            if date_obj is None:
                print(f"Could not parse date: {date_str}")
                continue
            
            formatted_date = date_obj.strftime("%Y-%m-%d")
            
            # Alpha Vantage format: timestamp,open,high,low,close,volume
            # row[1]=open, row[4]=close
            open_price = float(row[1])
            close_price = float(row[4])
            
            if open_price > 0:
                change = ((close_price - open_price) / open_price) * 100
                change_str = f"{change:+.2f}%"
            else:
                change_str = "0.00%"
            
            result.append({
                "date": formatted_date,
                "price": close_price,
                "open": open_price,
                "high": float(row[2]) if len(row) > 2 else close_price,
                "low": float(row[3]) if len(row) > 3 else close_price,
                "volume": row[5] if len(row) > 5 else "0",
                "change": change_str,
                "file_name": "api"
            })
        except (ValueError, IndexError) as e:
            print(f"Error parsing row {row}: {e}")
            continue
    
    return result

@app.get("/api/stock-data")
async def get_stock_data(range: str = "1d", symbol: str = "IBM"):
    """
    Fetch stock data for the specified time range
    
    Parameters:
    - range: Time range (1d, 1w, 1m, 1y)
    - symbol: Stock symbol (default: IBM)
    """
    try:
        # Get the appropriate function index based on range
        function_index = get_function_index_for_range(range)
        
        # Fetch data from API
        print(f"Fetching data for {symbol} with range {range}")
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
        
        # Parse the data into JSON format
        stock_data = parse_stock_data(csv_data)
        
        if not stock_data:
            raise HTTPException(status_code=404, detail="No data found after parsing")
        
        # Filter by date range
        date_range = calculate_date_range(range)
        start_date = datetime.strptime(date_range[0], "%m/%d/%Y")
        end_date = datetime.strptime(date_range[1], "%m/%d/%Y")
        
        filtered_data = [
            item for item in stock_data
            if start_date <= datetime.strptime(item["date"], "%Y-%m-%d") <= end_date
        ]
        
        if not filtered_data:
            # If no data in exact range, return all data (API might have its own limits)
            filtered_data = stock_data
        
        return {
            "success": True,
            "data": filtered_data,
            "range": range,
            "symbol": symbol
        }
        
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
