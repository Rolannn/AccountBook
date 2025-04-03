const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// 1. 连接数据库
const adapter = new FileSync('db.json');
const db = low(adapter);

// 2. 设置默认结构
db.defaults({ posts: [], users: [] }).write();

// 3. 添加数据
db.get('posts').push({ id: 1, title: 'adada' }).write();
