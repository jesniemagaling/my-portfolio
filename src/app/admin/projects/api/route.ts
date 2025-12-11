import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { makeSlug } from '@/lib/slugify';

const collection = 'projects';

export async function GET(
  _req: NextRequest,
  _context: { params: Promise<{}> }
) {
  const auth = await requireAdmin(_req);
  if (auth) return auth;

  try {
    const snapshot = await adminDB
      .collection(collection)
      .orderBy('createdAt', 'desc')
      .get();
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  _context: { params: Promise<{}> }
) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    const slug = makeSlug(body.name);

    const docRef = adminDB.collection(collection).doc(slug);
    await docRef.set({
      name: body.name,
      slug,
      description: body.description || '',
      image: body.image || '',
      stack: Array.isArray(body.stack) ? body.stack : [],
      linkRepo: body.linkRepo || '',
      linkLive: body.linkLive || '',
      createdAt: Timestamp.now(),
    });

    const created = await docRef.get();
    return NextResponse.json(
      { id: created.id, ...created.data() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, _context: { params: Promise<{}> }) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    if (!body.slug)
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const docRef = adminDB.collection(collection).doc(body.slug);
    await docRef.set(
      {
        name: body.name,
        description: body.description || '',
        image: body.image || '',
        stack: Array.isArray(body.stack) ? body.stack : [],
        linkRepo: body.linkRepo || '',
        linkLive: body.linkLive || '',
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    const updated = await docRef.get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Admin PUT Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  _context: { params: Promise<{}> }
) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    if (!slug)
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    await adminDB.collection(collection).doc(slug).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
