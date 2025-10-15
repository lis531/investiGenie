import { NextRequest, NextResponse } from 'next/server';
import { readStockDataFromCSV, StockData } from '../../../utils/csvParser';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file') || 'toy_s&p500.csv';
    const stockData = await readStockDataFromCSV(file);

    return NextResponse.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}