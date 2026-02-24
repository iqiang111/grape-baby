import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif"];
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();

    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: "仅支持 JPG、PNG、GIF、WebP、HEIC 格式的图片" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "图片大小不能超过 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filePath = path.join(UPLOAD_DIR, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ path: `/uploads/${uniqueName}` });
  } catch {
    return NextResponse.json({ error: "上传失败，请重试" }, { status: 500 });
  }
}
