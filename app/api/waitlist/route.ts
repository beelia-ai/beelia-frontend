import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Get Google Apps Script Web App URL from environment variable
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      // Return default 500+ if script URL is not configured
      return NextResponse.json(
        {
          success: true,
          count: 500,
          displayCount: "500+",
        },
        { status: 200 }
      );
    }

    // Call Google Apps Script to get the count
    // The script should handle a GET request with action=getCount and return { count: number }
    // Or it can handle a POST request with { action: 'getCount' }
    let response;
    let result;
    let count: number | null = null;

    // Try GET first
    try {
      response = await fetch(`${scriptUrl}?action=getCount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      });

      if (response.ok) {
        const responseText = await response.text();
        try {
          result = JSON.parse(responseText);
          // Extract count from result
          count =
            result.count ||
            result.total ||
            result.rows ||
            result.rowCount ||
            null;
        } catch {
          // If not JSON, try POST method
          throw new Error("GET response not JSON, trying POST");
        }
      } else {
        throw new Error("GET request failed, trying POST");
      }
    } catch {
      // If GET fails, try POST with action=getCount
      try {
        response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "getCount" }),
          redirect: "follow",
        });

        if (response.ok) {
          const responseText = await response.text();
          try {
            result = JSON.parse(responseText);
            // Extract count from result
            count =
              result.count ||
              result.total ||
              result.rows ||
              result.rowCount ||
              null;
          } catch {
            // If parsing fails, count remains null
            count = null;
          }
        } else {
          // If POST fails, count remains null
          count = null;
        }
      } catch {
        // If both methods fail, count remains null
        count = null;
      }
    }

    // If we got a valid count, format it
    if (count !== null && typeof count === "number" && count >= 0) {
      // Round down to nearest 100, minimum 500
      const roundedCount = Math.max(500, Math.floor(count / 100) * 100);
      return NextResponse.json(
        {
          success: true,
          count: count,
          displayCount: `${roundedCount}+`,
        },
        { status: 200 }
      );
    }

    // If count is invalid or null, return default 500+
    return NextResponse.json(
      {
        success: true,
        count: 500,
        displayCount: "500+",
      },
      { status: 200 }
    );
  } catch {
    // Return default 500+ on any exception
    return NextResponse.json(
      {
        success: true,
        count: 500,
        displayCount: "500+",
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, platformLink, userType, action } =
      await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get Google Apps Script Web App URL from environment variable
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Prepare data based on action type
    const payload: Record<string, string> = {
      email,
      timestamp: new Date().toISOString(),
    };

    // If this is an update action, include name, userType, and conditional fields
    if (action === "update") {
      payload.action = "update";
      if (name) payload.name = name;
      if (userType) payload.userType = userType;
      if (userType === "creator" && platformLink)
        payload.platformLink = platformLink;
    }

    // Send data to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow", // Important for Google Apps Script
    });

    // Get response text first to see what we're getting
    const responseText = await response.text();
    console.log("GAS Response Status:", response.status);
    console.log("GAS Response Text:", responseText);

    if (!response.ok) {
      console.error("GAS Error:", response.status, responseText);
      throw new Error(
        `Google Apps Script error: ${response.status} - ${responseText}`
      );
    }

    // Try to parse JSON. If it fails, it's an error (likely HTML returned due to permissions)
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse GAS response as JSON:", responseText.substring(0, 200));
      throw new Error(
        `Invalid response from Google Apps Script. Expected JSON but got: ${responseText.substring(0, 50)}... (Likely permission issue)`
      );
    }

    // Check for explicit error in the result from Apps Script
    if (result && (result.success === false || result.error)) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Google Apps Script returned an error",
          data: result,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          action === "update"
            ? "Profile updated successfully"
            : "Email added to waitlist successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
