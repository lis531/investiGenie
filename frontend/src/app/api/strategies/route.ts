import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || '^GSPC';
    const startCash = searchParams.get('startCash') || '10000';
    const monthlyCash = searchParams.get('monthlyCash') || '1000';

    const backendUrl = `http://localhost:8000/api/strategies?symbol=${symbol}&start_cash=${startCash}&monthly_cash=${monthlyCash}`;
    
    const response = await fetch(backendUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch strategies' },
      { status: 500 }
    );
  }
}
