import { Bike, Product, JournalPost, Profile, Order } from '@/types/database';

export const mockProfile: Profile = {
  id: 'SKL-001',
  full_name: 'Raihan Putra',
  email: 'raihan@sakala.cc',
  avatar_url: '/assets/avatar_user.png',
  role: 'member',
  created_at: '2024-03-12T00:00:00Z',
};

export const mockBikes: Bike[] = [
  {
    id: 'bike-01',
    title: "'KUJANG GOLD'",
    year: 1978,
    make: 'Honda',
    model: 'CB550 Four',
    description: 'Custom cafe-racer dengan rangka de-tabbed, knalpot megaphone kustom, dan tangki bensin buatan tangan bermotif Kujang.',
    specs: {
      frame: 'De-tabbed Raw Steel',
      exhaust: '4-into-1 Custom Megaphone',
      workshop: 'Garasi Sakala',
      displacement: '550cc Inline-Four',
    },
    image_url: '/assets/bike_cb550.png',
    gallery: [
      '/assets/bike_cb550.png',
    ],
    status: 'archival',
  },
  {
    id: 'bike-02',
    title: "'NIGHT CRAWLER'",
    year: 1982,
    make: 'Yamaha',
    model: 'XS650',
    description: 'Bobber hardtail minimalis berbasis mesin twin 650cc dengan postur rendah.',
    specs: {
      engine: '650cc Twin Rebuilt Stage II',
      chassis: 'Weld-on Rigid Hardtail',
      wheels: "19\" Front / 16\" Rear Firestone",
      displacement: '654cc Parallel-Twin',
    },
    image_url: '/assets/bike_xs650.png',
    gallery: [
      '/assets/bike_xs650.png',
    ],
    status: 'commissioned',
  },
  {
    id: 'bike-03',
    title: "'THE NOMAD'",
    year: 1994,
    make: 'Harley-Davidson',
    model: 'Sportster 1200',
    description: 'Scrambler tangguh jarak jauh dengan knalpot high-mount kembar dan suspensi Ohlins 390mm.',
    specs: {
      exhaust: 'Twin High-Mount Scrambler',
      suspension: 'Ohlins Piggyback 390mm',
      displacement: '1200cc Evolution V-Twin',
      workshop: 'Garasi Sakala',
    },
    image_url: '/assets/bike_sportster.png',
    gallery: [
      '/assets/bike_sportster.png',
    ],
    status: 'private_collection',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-01',
    sku: 'SKL-TEE-01',
    name: 'CIRCLE EMBLEM HEAVYWEIGHT TEE',
    category: 't-shirts',
    price_idr: 385000,
    price_usd: 28,
    stock_status: 'available',
    stock_count: 15,
    description: 'Bahan katun berat dengan sablon emblem resmi Sakala.',
    image_url: '/assets/product_tee.png',
  },
  {
    id: 'prod-02',
    sku: 'SKL-HD-02',
    name: 'GARAGE CREW ZIP HOODIE',
    category: 'hoodies',
    price_idr: 720000,
    price_usd: 52,
    stock_status: 'low_stock',
    stock_count: 4,
    description: 'Bahan French Terry warna hitam dengan bordir emblem Sakala.',
    image_url: '/assets/product_hoodie.png',
  },
  {
    id: 'prod-03',
    sku: 'SKL-JKT-03',
    name: 'BROTHERHOOD COACH JACKET',
    category: 'jackets',
    price_idr: 1150000,
    price_usd: 82,
    stock_status: 'available',
    stock_count: 8,
    description: 'Jaket coach warna navy dengan lapisan dalam furing dan bordir Sakala.',
    image_url: '/assets/product_jacket.png',
  },
  {
    id: 'prod-04',
    sku: 'SKL-CAP-04',
    name: 'LOYALTY TRUCKER CAP',
    category: 'headwear',
    price_idr: 260000,
    price_usd: 19,
    stock_status: 'waitlist',
    stock_count: 0,
    description: 'Topi trucker jaring dengan bordir depan Sakala.',
    image_url: '/assets/product_cap.png',
  },
];

export const mockJournalPosts: JournalPost[] = [
  {
    id: 'post-01',
    title: 'PERJALANAN TANGKUBAN PERAHU DI PAGI HARI',
    slug: 'the-ascent-of-tangkuban-perahu',
    category: 'PERJALANAN',
    read_time: '5 MENIT BACA',
    author: 'A. Pratama',
    author_role: 'Anggota Sakala',
    photographer: 'Dokumentasi Sakala',
    publish_date: 'September 2024',
    excerpt: 'Catatan perjalanan riding bersama menembus kabut pagi jalur Lembang menuju Tangkuban Perahu.',
    content: `
### Rute Pagi — Lembang Menuju Tangkuban

Perjalanan dimulai dari Bandung sebelum fajar menyingsing. Udara dingin pegunungan menyambut saat rombongan motor mulai menanjak melewati jalur Setiabudhi hingga Lembang.

Sembilan motor berjalan beriringan dengan kecepatan stabil. Jalanan yang basah menuntut kehati-hatian ekstra dan rasa saling jaga antar pengendara di barisan.

### Titik Temu Kawah

Saat matahari mulai naik, rombongan tiba di area puncak. Mesin-mesin dimatikan bergantian, memberi ruang bagi suara alam pegunungan dan kopi panas yang diseduh bersama di pinggir jalur.

Momen seperti ini mengingatkan kembali pada esensi berkendara bersama: bukan tentang kecepatan atau siapa yang paling depan, tetapi tentang kebersamaan dan cerita di sepanjang jalan.
    `,
    gallery: [
      '/assets/journal_subang.png',
      '/assets/culture_riders.png',
    ],
    cover_image_url: '/assets/journal_subang.png',
    featured: true,
  },
  {
    id: 'post-02',
    title: 'CATATAN DARI BENGKEL: PROSES BANGUN MOTOR KUSTOM',
    slug: 'forging-steel-ciroyom-engine-lab',
    category: 'BENGKEL',
    read_time: '4 MENIT BACA',
    author: 'R. Hendra',
    author_role: 'Dokumentasi Bengkel',
    photographer: 'Dokumentasi Sakala',
    publish_date: 'Agustus 2024',
    excerpt: 'Melihat lebih dekat proses perakitan, penyetelan mesin, dan pengerjaan motor kustom di bengkel.',
    cover_image_url: '/assets/culture_workshop.png',
    featured: false,
  },
  {
    id: 'post-03',
    title: 'PERSAUDARAAN DAN JALANAN: CERITA AWAL SAKALA',
    slug: 'meaning-of-the-circle-bandung-scene',
    category: 'CERITA',
    read_time: '6 MENIT BACA',
    author: 'Tim Redaksi',
    author_role: 'Dokumentasi Sakala',
    photographer: 'Dokumentasi Sakala',
    publish_date: 'Juli 2024',
    excerpt: 'Kilas balik perjalanan awal berdirinya Sakala dan komitmen persaudaraan yang terus dijaga.',
    cover_image_url: '/assets/culture_ceremony.png',
    featured: false,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'SKL-849201',
    customer_name: 'Raihan Putra',
    customer_email: 'raihan@sakala.cc',
    customer_phone: '+62 812-9842-1029',
    shipping_address: 'Jl. Jamika No. 42',
    city: 'Bandung',
    postal_code: '40182',
    courier: 'JNE YES',
    payment_method: 'BCA Virtual Account',
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        size: 'L',
      },
      {
        product: mockProducts[2],
        quantity: 1,
        size: 'OS',
      }
    ],
    subtotal_idr: 1100000,
    shipping_fee_idr: 35000,
    total_idr: 1135000,
    status: 'dispatching',
    created_at: '2024-09-20T14:32:00Z',
  },
  {
    id: 'SKL-719304',
    customer_name: 'Raihan Putra',
    customer_email: 'raihan@sakala.cc',
    customer_phone: '+62 812-9842-1029',
    shipping_address: 'Jl. Jamika No. 42',
    city: 'Bandung',
    postal_code: '40182',
    courier: 'J&T Cargo',
    payment_method: 'QRIS',
    items: [
      {
        product: mockProducts[1],
        quantity: 1,
        size: 'XL',
      }
    ],
    subtotal_idr: 785000,
    shipping_fee_idr: 35000,
    total_idr: 820000,
    status: 'delivered',
    created_at: '2024-09-15T09:12:00Z',
  }
];
