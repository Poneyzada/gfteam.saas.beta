const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_DIR = path.join(__dirname, '..', 'public', 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const files = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Ensure directory exists
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('⏳ Starting download of face-api models...');
  for (const filename of files) {
    const url = `${BASE_URL}${filename}`;
    const dest = path.join(MODEL_DIR, filename);
    try {
      await download(url, dest);
    } catch (error) {
      console.error(`❌ Error downloading ${filename}:`, error.message);
    }
  }
  console.log('🎉 All models downloaded successfully!');
}

main();
