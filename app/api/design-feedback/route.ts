import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

const DEFAULT_PROMPT = `You are a senior UI/UX designer reviewing a web application screenshot.
Provide specific, actionable feedback on:

1. **Visual Hierarchy** - Is the most important content emphasized? Are headings clear?
2. **Layout & Spacing** - Is the spacing consistent? Are elements aligned properly?
3. **Color & Contrast** - Are colors harmonious? Is text readable?
4. **Typography** - Are fonts appropriate? Is text sizing consistent?
5. **Component Design** - Do buttons, inputs, tables look polished?
6. **Dark Theme** - For dark themes, check if colors work well together
7. **Accessibility** - Any obvious accessibility concerns?

Be concise but specific. Mention exact issues and suggest fixes.
Format as bullet points grouped by category.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType = "image/png", prompt } = body;

    // Validate input
    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Initialize model - use flash for speed
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Prepare image part
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    // Create content with image and prompt
    const result = await model.generateContent([
      imagePart,
      { text: prompt || DEFAULT_PROMPT },
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      feedback: text,
      model: "gemini-2.0-flash",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get design feedback";
    return NextResponse.json(
      {
        error: errorMessage,
        details: String(error),
      },
      { status: 500 }
    );
  }
}
