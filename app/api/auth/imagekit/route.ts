import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// Destructuring method
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});


// Handle GET requests
export async function GET() {
  try {
    // Generate authentication parameters
    const authParams = imagekit.getAuthenticationParameters();

    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    return NextResponse.json(
      { message: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}