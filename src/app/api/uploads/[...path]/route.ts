import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  if (process.env.NODE_ENV === "development") {
    // 本地开发：从文件系统读取
    const fs = await import("fs/promises");
    const pathModule = await import("path");
    const filePath = pathModule.join(process.cwd(), "public", "uploads", key);
    try {
      const data = await fs.readFile(filePath);
      const ext = key.split(".").pop()?.toLowerCase() || "";
      const mimeMap: Record<string, string> = {
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
        gif: "image/gif", webp: "image/webp", heic: "image/heic",
      };
      return new NextResponse(data, {
        headers: { "Content-Type": mimeMap[ext] || "application/octet-stream" },
      });
    } catch {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // 生产环境：从 R2 读取
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext();
  const object = await env.R2.get(key);

  if (!object) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body, { headers });
}
