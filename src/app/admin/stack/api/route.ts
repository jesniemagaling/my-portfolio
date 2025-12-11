import { NextResponse, type NextRequest } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

const collection = 'techstack';

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const snapshot = await adminDB
      .collection(collection)
      .orderBy('name', 'asc')
      .get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    if (!body.name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const id = body.name.toLowerCase().replace(/\s+/g, '-');
    await adminDB
      .collection(collection)
      .doc(id)
      .set({
        name: body.name,
        icon: body.icon || '',
        category: body.category || '',
        link: body.link || '',
        createdAt: new Date(),
      });

    const created = await adminDB.collection(collection).doc(id).get();
    return NextResponse.json(
      { id: created.id, ...created.data() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json();
    if (!body.id)
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await adminDB
      .collection(collection)
      .doc(body.id)
      .set(
        {
          name: body.name,
          icon: body.icon,
          category: body.category,
          link: body.link || '',
          updatedAt: new Date(),
        },
        { merge: true }
      );

    const updated = await adminDB.collection(collection).doc(body.id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Admin PUT Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await adminDB.collection(collection).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
