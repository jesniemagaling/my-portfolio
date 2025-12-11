import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';

const collection = 'about';
const docId = 'main';

export async function GET() {
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
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Public GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
