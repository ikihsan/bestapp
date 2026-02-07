/**
 * Export Meilisearch index data for backup.
 * Usage: npx tsx scripts/export-meilisearch.ts
 */

import { MeiliSearch } from 'meilisearch';
import { writeFileSync, mkdirSync } from 'fs';

async function exportIndex() {
  const host = process.env.MEILI_HOST || 'http://localhost:7700';
  const apiKey = process.env.MEILI_MASTER_KEY || 'masterKey';
  const client = new MeiliSearch({ host, apiKey });

  const index = client.index('tools');
  const docs = await index.getDocuments({ limit: 1000 });

  mkdirSync('backups', { recursive: true });
  const outFile = `backups/meilisearch-export-${Date.now()}.json`;
  writeFileSync(outFile, JSON.stringify(docs.results, null, 2));
  console.log(`Exported ${docs.results.length} documents to ${outFile}`);
}

exportIndex().catch(console.error);
