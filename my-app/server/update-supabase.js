// Helper script to update Supabase configuration
// Usage: node update-supabase.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateConfig() {
  console.log('\n🔧 Supabase Configuration Updater\n');
  console.log('Please enter your new Supabase credentials:\n');

  const projectUrl = await question('Project URL (e.g., https://xxxxx.supabase.co): ');
  const anonKey = await question('Anon Key: ');
  const serviceRoleKey = await question('Service Role Key: ');

  console.log('\n📝 Updating files...\n');

  try {
    // Update server.js
    const serverPath = path.join(__dirname, 'server.js');
    let serverContent = await fs.readFile(serverPath, 'utf-8');
    
    // Replace Supabase URL and key
    serverContent = serverContent.replace(
      /const supabase = createClient\(\s*"[^"]*",\s*"[^"]*",/,
      `const supabase = createClient(\n  "${projectUrl}",\n  "${serviceRoleKey}",`
    );
    
    await fs.writeFile(serverPath, serverContent);
    console.log('✅ Updated server/server.js');

    // Update supabaseClient.js
    const clientPath = path.join(__dirname, '..', 'src', 'supabaseClient.js');
    let clientContent = await fs.readFile(clientPath, 'utf-8');
    
    clientContent = clientContent.replace(
      /const supabaseUrl = '[^']*';/,
      `const supabaseUrl = '${projectUrl}';`
    );
    clientContent = clientContent.replace(
      /const supabaseKey = '[^']*';/,
      `const supabaseKey = '${anonKey}';`
    );
    
    await fs.writeFile(clientPath, clientContent);
    console.log('✅ Updated src/supabaseClient.js');

    console.log('\n✨ Configuration updated successfully!');
    console.log('\n⚠️  Remember to:');
    console.log('1. Create the users table in Supabase (see UPDATE_SUPABASE_CONFIG.md)');
    console.log('2. Restart your server: npm start');
    
  } catch (err) {
    console.error('❌ Error updating files:', err.message);
  }

  rl.close();
}

updateConfig();
