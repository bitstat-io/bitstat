import { NextResponse } from "next/server";
import axios from "axios";

const API_CONFIG = {
  url: "https://api-gateway.skymavis.com/origins/v2/leaderboards",
  headers: {
    Accept: "application/json",
    "X-API-KEY": process.env.AXIE_API_KEY,
  },
  defaultParams: {
    seasonID: "s10-rare-era-1",
    limit: "100",
    offset: "0",
  },
};

export async function GET() {
  try {
    // Make the API request
    const response = await axios.get(API_CONFIG.url, {
      headers: API_CONFIG.headers,
    });

    // Return the successful response with game info
    return NextResponse.json({
      success: true,
      data: response.data,
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
