import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// 带 TTL 的内存缓存
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class TTLCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly ttl: number;

  constructor(ttlMs: number) {
    this.ttl = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// 5分钟缓存
const cache = new TTLCache<any[]>(5 * 60 * 1000);

// 并发控制
async function withConcurrencyLimit<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<any>
): Promise<any[]> {
  const results: any[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = fn(item).then(result => {
      results.push(result);
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // 详细日志（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log("API /api/posts called");
    console.log("NOTION_TOKEN exists:", !!config.notionToken);
    console.log("NOTION_TOKEN length:", config.notionToken?.length || 0);
    console.log("NOTION_DATABASE_IDS:", config.notionDatabaseIds);
    console.log("NOTION_DATABASE_NAMES:", config.notionDatabaseNames);
  }

  if (!config.notionToken) {
    if (process.env.NODE_ENV !== 'development') {
      console.error("ERROR: Notion API token is not configured");
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Notion API token is not configured",
    });
  }

  const databaseIds = config.notionDatabaseIds || [];
  const databaseNames = config.notionDatabaseNames || [];

  if (databaseIds.length === 0) {
    if (process.env.NODE_ENV !== 'development') {
      console.error("ERROR: No Notion databases configured");
    }
    throw createError({
      statusCode: 500,
      statusMessage: "No Notion databases configured",
    });
  }

  // 检查缓存
  const cacheKey = databaseIds.join(',');
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log("Returning cached data");
    return cached;
  }

  try {
    const notion = new Client({ 
      auth: config.notionToken,
      timeoutMs: 30000,
    });

    // 并行获取所有数据库
    const allPosts = await Promise.all(
      databaseIds.map(async (dbId, i) => {
        const dbName = databaseNames[i] || `Database ${i + 1}`;
        
        try {
          console.log(`Fetching from database: ${dbName} (${dbId})`);
          const response = await notion.dataSources.query({
            data_source_id: dbId,
          });
          console.log(`Found ${response.results.length} pages in ${dbName}`);

          // 限制并发数获取 blocks
          return await withConcurrencyLimit(
            response.results,
            5, // 最多同时5个请求
            async (page) => {
              try {
                const pageData = page as PageObjectResponse;
                const blocks = await Promise.race([
                  notion.blocks.children.list({
                    block_id: pageData.id,
                    page_size: 3,
                  }),
                  new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                  )
                ]);

                const props = pageData.properties;
                const titleProp = props?.["名称"] as { title: Array<{ plain_text: string }> } | undefined;
                const dateProp = props?.["日期"] as { date: { start: string } } | undefined;

                return {
                  id: pageData.id,
                  title: titleProp?.title?.[0]?.plain_text || "Untitled",
                  content: "",
                  date: dateProp?.date?.start || null,
                  databaseId: dbId,
                  databaseName: dbName,
                  previewBlocks: (blocks as any).results,
                };
              } catch (error) {
                console.warn(`Failed to fetch blocks for page ${(page as any).id}:`, error);
                return {
                  id: (page as any).id,
                  title: "Untitled",
                  content: "",
                  date: null,
                  databaseId: dbId,
                  databaseName: dbName,
                  previewBlocks: [],
                };
              }
            }
          );
        } catch (dbError: any) {
          console.error(`Error fetching from database ${dbName}:`, dbError.message);
          return [];
        }
      })
    );

    // 扁平化并排序
    const flattenedPosts = allPosts.flat();
    flattenedPosts.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    console.log(`Total posts fetched: ${flattenedPosts.length}`);

    // 存入缓存
    cache.set(cacheKey, flattenedPosts);

    return flattenedPosts;
  } catch (error: any) {
    console.error("Notion API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch Notion data: ${error.message}`,
    });
  }
});
