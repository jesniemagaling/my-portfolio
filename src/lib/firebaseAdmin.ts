import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const keyBase64 = process.env.FIREBASE_ADMIN_KEY_BASE64;
  if (!keyBase64) throw new Error('Missing FIREBASE_ADMIN_KEY_BASE64 env var');
  const serviceAccount = JSON.parse(
    Buffer.from(keyBase64, 'base64').toString('utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDB = admin.firestore();
export const adminStorage = admin.storage().bucket();
