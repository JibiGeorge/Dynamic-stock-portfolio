export async function fetchBatch<T>(
  items: string[],
  fetcher: (s: string) => Promise<T>,
  batchSize = 3,
  delayMs = 500
): Promise<Map<string, T | { error: string }>> {

  const results = new Map<string, T | { error: string }>();

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          const result = await fetcher(item);
          return { item, result };
        } catch (error: any) {
          return {
            item,
            result: { error: error.message || "Fetch failed" },
          };
        }
      })
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