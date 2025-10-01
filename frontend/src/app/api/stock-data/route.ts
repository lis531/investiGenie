import { NextRequest, NextResponse } from 'next/server';

const mockStockData = [
  { date: "2025-09-17", price: 659.00, open: 660.04, high: 660.65, low: 658.87, volume: "20.96M", change: "-0.15%" },
  { date: "2025-09-16", price: 660.00, open: 661.47, high: 661.78, low: 659.21, volume: "61.17M", change: "-0.14%" },
  { date: "2025-09-15", price: 660.91, open: 659.64, high: 661.04, low: 659.34, volume: "63.77M", change: "0.53%" },
  { date: "2025-09-12", price: 657.41, open: 657.60, high: 659.11, low: 656.90, volume: "72.78M", change: "-0.03%" },
  { date: "2025-09-11", price: 657.63, open: 654.18, high: 658.33, low: 653.59, volume: "69.93M", change: "0.83%" },
  { date: "2025-09-10", price: 652.21, open: 653.62, high: 654.55, low: 650.63, volume: "78.03M", change: "0.29%" },
  { date: "2025-09-09", price: 650.33, open: 648.97, high: 650.86, low: 647.22, volume: "66.13M", change: "0.23%" },
  { date: "2025-09-08", price: 648.83, open: 648.62, high: 649.84, low: 647.23, volume: "63.13M", change: "0.25%" },
  { date: "2025-09-05", price: 647.24, open: 651.48, high: 652.21, low: 643.33, volume: "85.18M", change: "-0.29%" },
  { date: "2025-09-04", price: 649.12, open: 644.42, high: 649.15, low: 643.51, volume: "65.22M", change: "0.84%" },
  { date: "2025-09-03", price: 643.74, open: 642.67, high: 644.21, low: 640.46, volume: "70.82M", change: "0.54%" },
  { date: "2025-09-02", price: 640.27, open: 637.50, high: 640.49, low: 634.92, volume: "81.98M", change: "-0.74%" },
  { date: "2025-08-29", price: 645.05, open: 647.47, high: 647.84, low: 643.14, volume: "74.52M", change: "-0.60%" },
  { date: "2025-08-28", price: 648.92, open: 647.24, high: 649.48, low: 645.34, volume: "61.52M", change: "0.35%" },
  { date: "2025-08-27", price: 646.63, open: 644.57, high: 647.37, low: 644.42, volume: "48.34M", change: "0.23%" },
  { date: "2025-08-26", price: 645.16, open: 642.20, high: 645.51, low: 641.57, volume: "51.58M", change: "0.42%" },
  { date: "2025-08-25", price: 642.47, open: 644.04, high: 645.29, low: 642.35, volume: "51.27M", change: "-0.44%" },
  { date: "2025-08-22", price: 645.31, open: 637.76, high: 646.50, low: 637.25, volume: "84.08M", change: "1.54%" },
  { date: "2025-08-21", price: 635.55, open: 636.28, high: 637.97, low: 633.81, volume: "54.81M", change: "-0.40%" }
];

export async function GET(request: NextRequest) {
  try {
    // In the future Python backend here
    // const response = await fetch('http://localhost:8000/api/csv-data');
    // const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: mockStockData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}