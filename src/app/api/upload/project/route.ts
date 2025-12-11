import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file)
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const filePath = path.join(imagesDir, filename);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ url: `/images/${filename}` });
};
