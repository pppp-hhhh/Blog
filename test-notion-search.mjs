// 搜索 Notion 中的所有页面和数据源
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

// 手动读取 .env 文件
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    const env = {};
    
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    }
    
    return env;
  } catch (error) {
    console.error('无法读取 .env 文件:', error.message);
    process.exit(1);
  }
}

const env = loadEnv();
const token = env.NOTION_TOKEN;

console.log('=== Notion 搜索测试 ===\n');

const notion = new Client({ auth: token });

async function searchNotion() {
  try {
    // 搜索所有数据源（数据库）
    console.log('搜索所有可访问的数据源...\n');
    const response = await notion.search({
      query: '',
      filter: {
        value: 'data_source',
        property: 'object'
      }
    });

    console.log(`找到 ${response.results.length} 个数据源:\n`);
    
    response.results.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title?.[0]?.plain_text || 'Untitled'}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   URL: https://www.notion.so/${item.id.replace(/-/g, '')}`);
      console.log('');
    });

    if (response.results.length === 0) {
      console.log('没有找到任何数据源。');
      console.log('请确保:');
      console.log('  1. 数据库已与集成共享');
      console.log('  2. 集成有正确的权限');
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('错误代码:', error.code);
  }
}

searchNotion();
