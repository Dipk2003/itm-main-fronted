const http = require('http');

const pages = [
  '/', '/about-us', '/api-docs', '/auth/user/login', '/auth/vendor/login', 
  '/cart', '/categories', '/chat', '/cities', '/dashboard', '/products', 
  '/profile', '/search', '/integration-test'
];

async function testPage(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      console.log(`✅ ${path}: ${res.statusCode}`);
      resolve({ path, status: res.statusCode, success: res.statusCode === 200 });
    });
    req.on('error', (err) => {
      console.log(`❌ ${path}: ${err.message}`);
      resolve({ path, status: 0, success: false });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`⏰ ${path}: timeout`);
      resolve({ path, status: 0, success: false });
    });
  });
}

async function runTests() {
  console.log('🔍 Testing key frontend pages...\n');
  let passed = 0;
  
  for (const page of pages) {
    const result = await testPage(page);
    if (result.success) passed++;
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n📊 Results: ${passed}/${pages.length} pages working`);
  return passed === pages.length;
}

runTests().then(success => {
  console.log(success ? '🎉 All tested pages working!' : '⚠️ Some pages need attention');
  process.exit(success ? 0 : 1);
});
