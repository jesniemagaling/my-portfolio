import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection('projects')
      .orderBy('createdAt', 'desc')
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Public GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
