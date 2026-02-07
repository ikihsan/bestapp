/**
 * Seed Firestore with initial data.
 * Usage: npx tsx scripts/seed-firestore.ts
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS
 */

async function seed() {
  // Dynamic import to avoid issues when firebase-admin is not configured
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { SEED_TOOLS, SEED_CATEGORIES } = await import('../src/lib/seed-data');

  const serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const app = serviceKey
    ? initializeApp({ credential: cert(JSON.parse(serviceKey)) })
    : initializeApp();

  const db = getFirestore(app);
  const batch = db.batch();

  console.log('Seeding categories...');
  for (const cat of SEED_CATEGORIES) {
    batch.set(db.collection('categories').doc(cat.id), cat);
  }

  console.log('Seeding tools...');
  for (const tool of SEED_TOOLS) {
    batch.set(db.collection('tools').doc(tool.id), tool);
  }

  await batch.commit();
  console.log(`Seeded ${SEED_CATEGORIES.length} categories and ${SEED_TOOLS.length} tools.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
