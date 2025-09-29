import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const offset = searchParams.get("offset") || "0";
    const limit = searchParams.get("limit") || "50";

    // Make the API request with proper parameters
    const response = await axios.get(
      `https://api-gateway.skymavis.com/origins/v2/leaderboards`,
      {
        headers: {
          Accept: "application/json",
          "X-API-KEY": process.env.AXIE_API_KEY,
        },
        params: {
          limit: limit,
          offset: offset,
        },
      }
    );

    // Return the successful response with game info
    return NextResponse.json({
      success: true,
      data: response.data,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total: response.data._metadata?.total || null,
        hasNext: response.data._metadata?.hasNext || false,
      },
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching leaderboard:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: error.response?.data || "Failed to fetch leaderboard data",
          status: error.response?.status,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
