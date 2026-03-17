// 检查 Notion 数据库的属性结构
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
const databaseId = env.NOTION_DATABASE_ID;

console.log('=== Notion 数据库属性检查 ===\n');

const notion = new Client({ auth: token });

async function checkProperties() {
  try {
    // 获取数据库信息
    console.log('获取数据库信息...\n');
    const database = await notion.dataSources.retrieve({
      data_source_id: databaseId,
    });

    console.log('数据库标题:', database.title?.[0]?.plain_text || 'Untitled');
    console.log('\n数据库属性:');
    
    for (const [key, value] of Object.entries(database.properties)) {
      console.log(`  - ${key}: ${value.type}`);
    }

    console.log('\n\n获取第一个页面的属性...\n');
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      page_size: 1,
    });

    if (response.results.length > 0) {
      const page = response.results[0];
      console.log('页面 ID:', page.id);
      console.log('\n页面属性:');
      
      for (const [key, value] of Object.entries(page.properties)) {
        console.log(`\n  ${key} (${value.type}):`);
        
        // 根据类型显示内容
        if (value.type === 'title' && value.title) {
          const text = value.title.map(t => t.plain_text).join('');
          console.log(`    内容: "${text}"`);
        } else if (value.type === 'rich_text' && value.rich_text) {
          const text = value.rich_text.map(t => t.plain_text).join('');
          console.log(`    内容: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
        } else if (value.type === 'date' && value.date) {
          console.log(`    日期: ${value.date.start}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('错误代码:', error.code);
  }
}

checkProperties();
