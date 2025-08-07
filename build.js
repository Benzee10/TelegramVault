#!/usr/bin/env node

import { build } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildProject() {
  console.log('🚀 Starting build process...');
  
  try {
    // Build the client
    console.log('📦 Building client...');
    await build({
      root: '.',
      build: {
        outDir: 'dist',
      }
    });
    console.log('✅ Client build complete');

    // Build the server
    console.log('🔧 Building server...');
    await execAsync('esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/server.js --external:@neondatabase/serverless --external:ws --external:express --format=esm');
    console.log('✅ Server build complete');

    console.log('🎉 Build process completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();