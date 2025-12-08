import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get Google Apps Script Web App URL from environment variable
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Sending to Google Apps Script:', {
      url: scriptUrl.replace(/\/[^\/]+$/, '/***'), // Hide script ID in logs
      email: email,
    });

    // Send data to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
      }),
      redirect: 'follow', // Important for Google Apps Script
    });

    // Get response text first to see what we're getting
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Google Apps Script response error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      throw new Error(`Google Apps Script error: ${response.status} - ${responseText}`);
    }

    // Try to parse JSON, but handle text responses too
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If not JSON, treat as success if status is OK
      result = { message: responseText || 'Success' };
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email added to waitlist successfully',
        data: result 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add email to waitlist',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

