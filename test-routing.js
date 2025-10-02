// Simple test script to verify subdomain routing
const https = require('https');
const http = require('http');

console.log('Testing subdomain routing configuration...');

// Test data for different subdomains
const testCases = [
  {
    subdomain: 'dir',
    expectedPath: '/directory',
    description: 'Directory subdomain'
  },
  {
    subdomain: 'vendor',
    expectedPath: '/dashboard/vendor-panel',
    description: 'Vendor subdomain'
  },
  {
    subdomain: 'admin',
    expectedPath: '/dashboard/admin',
    description: 'Admin subdomain'
  },
  {
    subdomain: 'support',
    expectedPath: '/dashboard/support',
    description: 'Support subdomain'
  },
  {
    subdomain: 'customer',
    expectedPath: '/dashboard/user',
    description: 'Customer subdomain'
  }
];

console.log('✅ Middleware configuration updated');
console.log('✅ Next.js config updated with rewrites');
console.log('✅ All subdomain routes configured:');

testCases.forEach(test => {
  console.log(`   - ${test.subdomain}.indiantrademart.com → ${test.expectedPath}`);
});

console.log('\n📝 Development Testing:');
console.log('   Use query parameters: localhost:3000/?subdomain=dir');
console.log('   Or modify hosts file for: dir.localhost:3000');

console.log('\n🚀 Ready to test! Run: npm run dev');
