import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await adminDB.collection('techstack').get();

    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (err) {
    console.error('Error fetching public tech stack:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
