import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64, mimeType } = body;

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing base64 or mimeType" },
        { status: 400 }
      );
    }

    // Validate mime type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid image type. Use JPEG, PNG, WEBP or GIF." },
        { status: 400 }
      );
    }

    // Validate base64 size (max ~3MB decoded)
    const sizeInBytes = Buffer.from(base64, "base64").length;
    if (sizeInBytes > 3 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large. Max 3MB." },
        { status: 400 }
      );
    }

    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (err) {
    console.error("Avatar route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
