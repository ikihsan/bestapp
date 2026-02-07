import { MeiliSearch } from 'meilisearch';

const meiliHost = process.env.MEILI_HOST || 'http://localhost:7700';
const meiliKey = process.env.MEILI_MASTER_KEY || '';

export const meiliClient = new MeiliSearch({
  host: meiliHost,
  apiKey: meiliKey,
});

export const TOOLS_INDEX = 'tools';

export async function ensureToolsIndex() {
  try {
    await meiliClient.getIndex(TOOLS_INDEX);
  } catch {
    await meiliClient.createIndex(TOOLS_INDEX, { primaryKey: 'id' });
    const index = meiliClient.index(TOOLS_INDEX);
    await index.updateSearchableAttributes([
      'name',
      'tagline',
      'description',
      'tags',
      'categories',
    ]);
    await index.updateFilterableAttributes(['categories', 'pricing.free', 'featured', 'status']);
    await index.updateSortableAttributes(['rating.avg', 'metrics.views', 'createdAt']);
    await index.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ]);
  }
}
