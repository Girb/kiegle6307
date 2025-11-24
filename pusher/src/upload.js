import fs from 'fs';
import SftpClient from 'ssh2-sftp-client';
import { CONFIG } from '../config.js';
import { generateHtml } from './generate.js';

async function uploadOnce() {
  const sftp = new SftpClient();
  try {
    // Load key only if using key auth
    const privateKey = CONFIG.privateKeyPath
      ? fs.readFileSync(CONFIG.privateKeyPath)
      : undefined;

    await sftp.connect({
      host: CONFIG.host,
      username: CONFIG.username,
      privateKey,
      password: CONFIG.password, // ignored if privateKey is present
      readyTimeout: 15000
    });

    console.log('Connected to server.');

    await sftp.fastPut(CONFIG.localFile, CONFIG.remotePath);
    console.log(`Uploaded ${CONFIG.localFile} → ${CONFIG.remotePath}`);
  } catch (err) {
    console.error('Upload failed:', err.message || err);
  } finally {
    sftp.end();
  }
}

async function loop() {
  while (true) {
    await generateHtml();
    await uploadOnce();
    await new Promise(r => setTimeout(r, CONFIG.interval));
  }
}

loop();
