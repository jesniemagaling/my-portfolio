import { NextResponse, type NextRequest } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const collection = 'about';
const docId = 'main';

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;
  try {
    const doc = await adminDB.collection(collection).doc(docId).get();

    if (!doc.exists) {
      return NextResponse.json({
        id: docId,
        about: '',
        goal: '',
        education: [],
      });
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error('Admin About GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json();

    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    if (typeof body.about === 'string') updateData.about = body.about;
    if (typeof body.goal === 'string') updateData.goal = body.goal;
    if (Array.isArray(body.education)) updateData.education = body.education;

    await adminDB
      .collection(collection)
      .doc(docId)
      .set(updateData, { merge: true });

    const updated = await adminDB.collection(collection).doc(docId).get();

    return NextResponse.json({
      id: updated.id,
      ...updated.data(),
    });
  } catch (error) {
    console.error('Admin About PUT Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    await adminDB.collection(collection).doc(docId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin About DELETE Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
