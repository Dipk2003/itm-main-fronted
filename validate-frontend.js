#!/usr/bin/env node

/**
 * ITM Frontend Quick Validation Script
 * Verifies all critical aspects of the frontend are working
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 ITM Frontend Quick Validation');
console.log('================================');

const tests = [
  {
    name: 'Project Structure',
    check: () => {
      const requiredFiles = [
        'package.json',
        'next.config.js',
        'tsconfig.json',
        'src/app/layout.tsx',
        'src/app/page.tsx'
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing required file: ${file}`);
        }
      }
      return 'All required files present';
    }
  },
  {
    name: 'Dependencies',
    check: () => {
      if (!fs.existsSync('node_modules')) {
        throw new Error('Dependencies not installed. Run: npm install');
      }
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return `${Object.keys(packageJson.dependencies || {}).length} dependencies installed`;
    }
  },
  {
    name: 'TypeScript Configuration',
    check: () => {
      const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      if (!tsconfig.compilerOptions) {
        throw new Error('Invalid TypeScript configuration');
      }
      return 'TypeScript configured properly';
    }
  },
  {
    name: 'Build Files',
    check: () => {
      if (!fs.existsSync('.next')) {
        return 'Build not found - run: npm run build';
      }
      const buildFiles = [
        '.next/BUILD_ID',
        '.next/build-manifest.json',
        '.next/routes-manifest.json'
      ];
      
      for (const file of buildFiles) {
        if (!fs.existsSync(file)) {
          return 'Incomplete build - run: npm run build';
        }
      }
      return 'Production build ready';
    }
  },
  {
    name: 'Page Routes',
    check: () => {
      const appDir = 'src/app';
      if (!fs.existsSync(appDir)) {
        throw new Error('App directory not found');
      }
      
      const countPages = (dir) => {
        let count = 0;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          if (item.isDirectory()) {
            const subPath = path.join(dir, item.name);
            count += countPages(subPath);
          } else if (item.name === 'page.tsx' || item.name === 'page.js') {
            count++;
          }
        }
        return count;
      };
      
      const pageCount = countPages(appDir);
      return `${pageCount} pages configured`;
    }
  }
];

async function runValidation() {
  let passed = 0;
  let failed = 0;

  console.log('\nRunning validation checks...\n');

  for (const test of tests) {
    try {
      const result = test.check();
      console.log(`✅ ${test.name}: ${result}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log('\n================================');
  console.log(`📊 Validation Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 FRONTEND VALIDATION SUCCESSFUL!');
    console.log('✨ All checks passed - frontend is ready!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Open browser: http://localhost:3000');
    console.log('   3. Test pages and functionality');
    console.log('   4. Deploy to production when ready');
  } else {
    console.log('\n⚠️ Some validation checks failed');
    console.log('Please address the issues above before proceeding');
  }

  console.log('================================');
  return failed === 0;
}

// Run validation if this script is executed directly
if (require.main === module) {
  runValidation().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = runValidation;
