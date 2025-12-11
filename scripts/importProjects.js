// scripts/importProjects.js
import admin from 'firebase-admin';
import fs from 'fs';

// Load your service account JSON
const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load the JSON array
const data = JSON.parse(fs.readFileSync('./seed-projects.json', 'utf8'));

async function importProjects() {
  for (const project of data) {
    const slug = project.slug;
    await db
      .collection('projects')
      .doc(slug)
      .set({
        name: project.title,
        slug: project.slug,
        description: project.description || '',
        image: project.image || '',
        stack: Array.isArray(project.tech) ? project.tech : [],
        linkLive: project.linkLive || '',
        linkRepo: project.linkRepo || '',
        createdAt: admin.firestore.Timestamp.now(),
      });
    console.log(`Imported project: ${project.title}`);
  }
  console.log('All projects imported!');
}

importProjects();
