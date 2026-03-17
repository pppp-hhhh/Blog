// 测试 Notion API 连接的脚本
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

console.log('=== Notion API 连接测试 ===\n');
console.log('Token 前缀:', token ? token.substring(0, 20) + '...' : '未设置');
console.log('Database ID:', databaseId || '未设置');
console.log('');

if (!token || !databaseId) {
  console.error('❌ 错误: 环境变量未设置');
  process.exit(1);
}

const notion = new Client({ auth: token });

async function testConnection() {
  try {
    // 测试 1: 获取用户信息
    console.log('测试 1: 获取用户信息...');
    const user = await notion.users.me();
    console.log('✅ 用户信息:', user.name || 'Bot');
    console.log('');

    // 测试 2: 查询数据库
    console.log('测试 2: 查询数据库...');
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    });
    console.log(`✅ 成功! 找到 ${response.results.length} 个页面`);
    console.log('');

    // 显示前 3 个页面的标题
    if (response.results.length > 0) {
      console.log('页面列表:');
      response.results.slice(0, 3).forEach((page, index) => {
        const title = page.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
        console.log(`  ${index + 1}. ${title}`);
      });
    }

    console.log('\n✅ 所有测试通过!');
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('错误代码:', error.code);
    
    if (error.code === 'unauthorized') {
      console.log('\n💡 提示: API 密钥无效。请检查:');
      console.log('   1. 密钥是否正确复制');
      console.log('   2. 数据库是否与集成共享');
      console.log('   3. 集成是否有读取权限');
    }
    
    if (error.code === 'object_not_found') {
      console.log('\n💡 提示: 数据库未找到。请检查:');
      console.log('   1. Database ID 是否正确');
      console.log('   2. 数据库是否与集成共享');
    }
    
    process.exit(1);
  }
}

testConnection();
