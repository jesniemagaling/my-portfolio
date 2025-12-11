import { NextResponse, type NextRequest } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

const collection = 'techStack';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const docSnap = await adminDB.collection(collection).doc(id).get();
    if (!docSnap.exists)
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const body = await req.json();
    if (!body.name && !body.icon)
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

    await adminDB.collection(collection).doc(id).update({
      name: body.name,
      icon: body.icon,
      category: body.category,
      link: body.link,
      updatedAt: new Date(),
    });

    const updated = await adminDB.collection(collection).doc(id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await adminDB.collection(collection).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
