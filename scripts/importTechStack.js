// scripts/importTechStack.js
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync('./seed-tech-stack.json', 'utf8'));

async function importTechStack() {
  for (const [docId, docData] of Object.entries(data)) {
    await db.collection('techstack').doc(docId).set(docData);
    console.log(`Imported ${docId}`);
  }
  console.log('All documents imported!');
}

importTechStack();
