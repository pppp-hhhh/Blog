import { Client } from '@notionhq/client';

const c = new Client({auth: 'test'});
console.log('Client keys:', Object.keys(c));
console.log('Databases:', typeof c.databases);
console.log('Databases keys:', c.databases ? Object.keys(c.databases) : 'undefined');
console.log('Query method:', typeof c.databases?.query);
