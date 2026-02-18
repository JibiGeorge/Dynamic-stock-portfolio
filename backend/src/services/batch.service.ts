export async function fetchBatch<T>(
  items: string[],
  fetcher: (s: string) => Promise<T>,
  batchSize = 3,
  delayMs = 500
): Promise<Map<string, T>> {
  const results = new Map<string, T>();

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (item) => ({
        item,
        result: await fetcher(item),
      }))
    );

    for (const { item, result } of batchResults) {
      results.set(item, result);
    }

    if (i + batchSize < items.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}
