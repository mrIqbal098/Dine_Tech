import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const url = String(req.nextUrl.searchParams.get("url") || "");
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    const remoteRes = await fetch(url);
    if (!remoteRes.ok) {
      const text = await remoteRes.text();
      return new NextResponse(text, { status: remoteRes.status });
    }

    const contentType =
      remoteRes.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await remoteRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const res = new NextResponse(buffer, {
      status: 200,
    });

    res.headers.set("Content-Type", contentType);
    res.headers.set("Content-Length", String(buffer.length));
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");

    return res;
  } catch (err) {
    console.error("proxy error", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}
