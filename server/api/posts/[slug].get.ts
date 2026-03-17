import { Client } from "@notionhq/client";
import type { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// 带 TTL 的缓存
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
}

const cache = new TTLCache<{ meta: any; blocks: any[] }>(5 * 60 * 1000);

// 递归获取所有 blocks（包括嵌套）
async function getAllBlocks(
  notion: Client, 
  blockId: string, 
  depth = 0
): Promise<BlockObjectResponse[]> {
  if (depth > 3) return []; // 限制递归深度

  try {
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      });

      for (const block of response.results as BlockObjectResponse[]) {
        blocks.push(block);

        // 递归获取有子元素的块
        if (block.has_children) {
          const children = await getAllBlocks(notion, block.id, depth + 1);
          (block as any).children = children;
        }
      }

      cursor = response.next_cursor || undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.warn(`Failed to fetch blocks for ${blockId}:`, error);
    return [];
  }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Post ID required" });
  }

  const config = useRuntimeConfig();
  if (!config.notionToken) {
    throw createError({ statusCode: 500, statusMessage: "Notion token missing" });
  }

  // 检查缓存
  const cached = cache.get(slug);
  if (cached) {
    return cached;
  }

  try {
    const notion = new Client({ 
      auth: config.notionToken,
      timeoutMs: 30000,
    });
    
    // 获取页面
    const page = await notion.pages.retrieve({ page_id: slug }) as PageObjectResponse;

    if (!page) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }

    // 递归获取所有 blocks
    const blocks = await getAllBlocks(notion, page.id);

    // 提取属性
    const props = page.properties;
    const titleProp = props?.["名称"] as { title: Array<{ plain_text: string }> } | undefined;
    const dateProp = props?.["日期"] as { date: { start: string } } | undefined;

    const result = {
      meta: { 
        title: titleProp?.title?.[0]?.plain_text || "Untitled", 
        date: dateProp?.date?.start || null 
      },
      blocks,
    };

    // 存入缓存
    cache.set(slug, result);

    return result;
  } catch (error: any) {
    console.error("Notion API Error:", error);
    
    if (error.statusCode === 404) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: "Failed to fetch post data" 
    });
  }
});
