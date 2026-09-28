const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
const FILE_KEY = 'NCvqeeCrxJBJXPl3OlxrIi';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

const ASSET_MAPPING = {
  // Hero
  'hero_pillar.png': '32be1758011e80064ab52ab8c86565652f733676',
  'manifesto_thumb.png': '5233cb97f02339460cbe61717915ab61197f0037',
  
  // Bikes
  'bike_cb550.png': '0d3f46359a9462002f154d11184d813be6ef92ef',
  'bike_xs650.png': '13214604674c00cd7a77bb06f821b130d139e3a9',
  'bike_sportster.png': '8f811d47db7eefcfcc95be1ebb4eee9e53b707f3',
  
  // Products
  'product_tee.png': '4dbc7d0c39604611583acc0685fa617a74ef9fbd',
  'product_hoodie.png': 'df3513d5c01fad4ba890818451ec0df54b64b533',
  'product_jacket.png': '801bce4a8f23fd0ba54366e014cafa1b91f41e1c',
  'product_cap.png': '01cb5d41fc675bc17bedc4fd4277b33b1f9da04a',
  
  // Community / Culture
  'culture_patch.png': '1eccfc747015391ff16419aa37217c4e2b8bea6e',
  'culture_ceremony.png': 'd7781237f4991c8016dba4ae5df860fc9f2ab017',
  'culture_workshop.png': '047deac4b2b4a60d159d7230752cf2d268de5caa',
  'culture_members.png': '6d5be1a1c856eca85d06a8b2e2e07cce18c19baa',
  
  // Journal
  'journal_subang.png': '3dfce1944c74653018436925d19bbf19bb58d3f6',
  
  // Account
  'avatar_user.png': '70950c615b27318ceedff1ab46e7a9396bcf81e3'
};

async function main() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('Fetching image URLs from Figma...');
  const imagesData = await fetchJson(`https://api.figma.com/v1/files/${FILE_KEY}/images`);
  const imageMap = imagesData.meta.images;

  for (const [filename, ref] of Object.entries(ASSET_MAPPING)) {
    const s3Url = imageMap[ref];
    if (!s3Url) {
      console.warn(`[WARN] No URL for ${filename} (ref: ${ref})`);
      continue;
    }
    const dest = path.join(assetsDir, filename);
    console.log(`Downloading ${filename}...`);
    await downloadFile(s3Url, dest);
  }

  console.log('All assets downloaded successfully!');
}

main().catch(console.error);
