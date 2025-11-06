import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1d';
    const symbol = searchParams.get('symbol') || '^GSPC';

    // Call the Python FastAPI backend
    const response = await fetch(`${PYTHON_API_URL}/api/stock-data?range=${range}&symbol=${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Python API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data from backend' },
      { status: 500 }
    );
  }
}