import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync('./seed-about.json', 'utf8'));

async function importAbout() {
  await db
    .collection('about')
    .doc('main')
    .set({
      about: data.about.main.about || '',
      goal: data.about.main.goal || '',
      education: Array.isArray(data.about.main.education)
        ? data.about.main.education
        : [],
      updatedAt: admin.firestore.Timestamp.now(),
    });

  console.log('About me imported successfully!');
}

importAbout();
