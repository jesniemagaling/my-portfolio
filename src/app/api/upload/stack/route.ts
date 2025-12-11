import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // Get buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Save to public/icons
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(iconsDir, filename);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ url: `/icons/${filename}` });
};
