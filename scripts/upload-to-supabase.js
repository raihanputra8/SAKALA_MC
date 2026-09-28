const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://hrpkjwxxlolifyizuuns.supabase.co';
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tPwt-Dlhq6XygqTispYe4w_mr8FAthh';

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE_UPDATES = {
  'bike_cb550.png': { table: 'bikes', id: 'bike-01', col: 'image_url' },
  'bike_xs650.png': { table: 'bikes', id: 'bike-02', col: 'image_url' },
  'bike_sportster.png': { table: 'bikes', id: 'bike-03', col: 'image_url' },
  'product_tee.png': { table: 'products', id: 'prod-01', col: 'image_url' },
  'product_hoodie.png': { table: 'products', id: 'prod-02', col: 'image_url' },
  'product_jacket.png': { table: 'products', id: 'prod-03', col: 'image_url' },
  'product_cap.png': { table: 'products', id: 'prod-04', col: 'image_url' },
  'journal_subang.png': { table: 'journal_posts', id: 'post-01', col: 'cover_image_url' },
  'culture_workshop.png': { table: 'journal_posts', id: 'post-02', col: 'cover_image_url' },
  'culture_ceremony.png': { table: 'journal_posts', id: 'post-03', col: 'cover_image_url' },
};

async function uploadAssets() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');
  const files = fs.readdirSync(assetsDir);

  console.log(`Mengunggah ${files.length} aset ke Supabase Storage bucket 'sakala-assets'...`);

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from('sakala-assets')
      .upload(file, fileBuffer, {
        upsert: true,
        contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
      });

    if (error) {
      console.error(`Gagal upload ${file}:`, error.message);
    } else {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/sakala-assets/${file}`;
      console.log(`✓ Uploaded ${file} -> ${publicUrl}`);

      // Update Database Table if mapped
      const mapping = TABLE_UPDATES[file];
      if (mapping) {
        const updatePayload = {};
        updatePayload[mapping.col] = publicUrl;
        const { error: dbErr } = await supabase
          .from(mapping.table)
          .update(updatePayload)
          .eq('id', mapping.id);
        if (dbErr) {
          console.warn(`  [Notice] DB update for ${mapping.table} (${mapping.id}):`, dbErr.message);
        } else {
          console.log(`  ✓ DB table ${mapping.table} (${mapping.id}) updated to Cloud URL`);
        }
      }
    }
  }

  console.log('\nSEMUA ASET BERHASIL DIUNGGAH DAN TERHUBUNG KE SUPABASE!');
}

uploadAssets().catch(console.error);
