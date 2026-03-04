import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/payload";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length === 0) {
    return NextResponse.json({ articles: [], episodes: [] });
  }

  const results = await searchContent(query);
  return NextResponse.json(results);
}
