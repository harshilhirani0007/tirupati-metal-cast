import 'dotenv/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export type Param = string | number | boolean | null;

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: Param[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export const queryOne = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: Param[]
): Promise<T | null> => {
  const res = await pool.query<T>(text, params);
  return res.rows[0] ?? null;
};

async function init(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      grade TEXT NOT NULL,
      applications TEXT NOT NULL,
      color TEXT DEFAULT 'from-slate-700 to-slate-800',
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      image_url TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT DEFAULT '[]';

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed default settings
  const defaults: [string, string][] = [
    ['company_name', 'Shri Tirupati Metal Cast'],
    ['tagline', 'Precision Metal Casting Built to Last'],
    ['phone', '+91 98242 79626'],
    ['email', 'shreetirupatimetalcast@yahoo.com'],
    ['address', 'Shri Tirupati Metal Cast, Gujarat, India'],
    ['founded', '1999'],
    ['capacity', '500 MT'],
    ['clients_served', '200+'],
    ['delivery_rate', '99%'],
  ];
  for (const [k, v] of defaults) {
    await query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [k, v]);
  }

  // Seed products
  const { rows: [pc] } = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM products');
  if (parseInt(pc.count) === 0) {
    const seedProducts: [string, string, string, string, string, number, number][] = [
      ['Grey Iron Castings', 'Versatile, cost-effective castings with excellent damping and machinability.', 'IS 210 / ASTM A48', 'Engine blocks,Brake drums,Pump housings,Machine beds', 'from-slate-700 to-slate-800', 1, 1],
      ['Ductile Iron Castings', 'Ductile iron castings combine the castability of grey iron with the strength and ductility of steel. Ideal for components subject to shock and impact loads, our IS 1865 / ASTM A536 grade castings serve automotive, hydraulic, and heavy engineering sectors.', 'IS 1865 / ASTM A536', 'Crankshafts,Gearboxes,Valve bodies,Agricultural parts', 'from-orange-900 to-orange-800', 1, 3],
      ['Alloy Steel Castings', 'Premium alloy steel for extreme conditions and high-stress environments.', 'IS 1030 / ASTM A148', 'Mining equipment,Railway parts,Heavy machinery,Pressure vessels', 'from-blue-900 to-blue-800', 1, 3],
      ['SG Iron Castings', 'Spheroidal graphite (SG) iron castings provide a unique combination of high tensile strength, elongation, and fatigue resistance. Conforming to EN-GJS / ASTM A395 specifications, they are the preferred choice for wind energy, hydraulics, and precision automotive parts.', 'EN-GJS / ASTM A395', 'Hydraulic cylinders,Wind turbine parts,Auto components,Pipes & fittings', 'from-emerald-900 to-emerald-800', 1, 4],
      ['Stainless Steel Castings', 'Corrosion-resistant castings for food, chemical, and marine industries.', 'CF8 / CF8M / CD4MCu', 'Food processing,Chemical pumps,Marine fittings,Pharmaceutical', 'from-violet-900 to-violet-800', 1, 5],
      ['Machined Castings', 'Fully machined, ready-to-fit castings with tight tolerances.', 'Custom Tolerance', 'Engine components,Bearing housings,Flanges,Brackets', 'from-rose-900 to-rose-800', 1, 6],
    ];
    for (const p of seedProducts) {
      await query('INSERT INTO products (category, description, grade, applications, color, active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)', p);
    }
    console.log('[DB] Products seeded');
  }

  // Seed testimonials
  const { rows: [tc] } = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM testimonials');
  if (parseInt(tc.count) === 0) {
    const seeds: [string, string, string, string, number, string][] = [
      ['Rajesh Mehta', 'Purchase Manager', 'Bharat Engineering Works, Pune', 'Tirupati Metal Cast has been our casting partner for 8 years. Zero rejections in our last 3 orders.', 5, 'approved'],
      ['Priya Krishnamurthy', 'Supply Chain Head', 'AgriTech Components, Coimbatore', 'We shifted to Tirupati after quality issues with our previous supplier. The difference is night and day.', 5, 'approved'],
      ['Suresh Patel', 'Director', 'Patel Auto Parts, Rajkot', 'Their machined castings fit directly into our assembly line. No rework needed.', 5, 'approved'],
      ['Anand Sharma', 'GM – Operations', 'Indo Pumps Ltd, Ahmedabad', "Reliable, professional, and technically strong. Tight tolerances we couldn't get elsewhere.", 5, 'approved'],
    ];
    for (const t of seeds) {
      await query('INSERT INTO testimonials (name, role, company, text, rating, status) VALUES ($1,$2,$3,$4,$5,$6)', t);
    }
    console.log('[DB] Testimonials seeded');
  }

  // Seed sample enquiry
  const { rows: [ec] } = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM enquiries');
  if (parseInt(ec.count) === 0) {
    await query('INSERT INTO enquiries (name, company, email, phone, message, status) VALUES ($1,$2,$3,$4,$5,$6)', [
      'Sample Client', 'Demo Corp', 'demo@example.com', '+91 99999 00000',
      'We need 500 pcs of grey iron pump housings, 10 kg each. Please send quote.', 'new',
    ]);
    console.log('[DB] Sample enquiry seeded');
  }

  // Backfill product images & descriptions where image_url is empty
  const productUpdates: [string, string, string][] = [
    [
      'Grey Iron Castings',
      'Grey iron castings offer outstanding machinability, excellent vibration damping, and cost-effective production for high-volume industrial applications. Our IS 210 / ASTM A48 certified castings deliver consistent mechanical properties and surface finish across every batch.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608421/tirupati/grey-iron-castings.jpg',
    ],
    [
      'Ductile Iron Castings',
      'Ductile iron castings combine the castability of grey iron with the strength and ductility of steel. Ideal for components subject to shock and impact loads, our IS 1865 / ASTM A536 grade castings serve automotive, hydraulic, and heavy engineering sectors.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608055/tirupati/ductile-iron-castings.jpg',
    ],
    [
      'Alloy Steel Castings',
      'Alloy steel castings deliver superior hardness, wear resistance, and high-temperature performance for demanding applications. Produced to IS 1030 / ASTM A148 standards, these castings are used in mining, railways, and pressure equipment where failure is not an option.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608060/tirupati/alloy-steel-castings.jpg',
    ],
    [
      'SG Iron Castings',
      'Spheroidal graphite (SG) iron castings provide a unique combination of high tensile strength, elongation, and fatigue resistance. Conforming to EN-GJS / ASTM A395 specifications, they are the preferred choice for wind energy, hydraulics, and precision automotive parts.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608061/tirupati/sg-iron-castings.jpg',
    ],
    [
      'Stainless Steel Castings',
      'Investment and sand-cast stainless steel components manufactured to CF8, CF8M, and CD4MCu grades offer exceptional corrosion resistance and hygienic properties. Widely specified for food processing, chemical handling, marine, and pharmaceutical industries.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608062/tirupati/stainless-steel-castings.jpg',
    ],
    [
      'Machined Castings',
      'Fully machined castings delivered ready-to-assemble, eliminating secondary operations at your facility. Our in-house CNC turning, milling, boring, and grinding capabilities hold tolerances to ±0.05 mm, reducing your lead time and total cost of ownership.',
      'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778608064/tirupati/machined-castings.jpg',
    ],
  ];
  for (const [category, description, image_url] of productUpdates) {
    await query(
      `UPDATE products SET description=$1, image_url=$2 WHERE category=$3 AND (image_url IS NULL OR image_url='' OR image_url LIKE '%unsplash%')`,
      [description, image_url, category]
    );
  }
  console.log('[DB] Product images & descriptions backfilled');

  console.log('[DB] PostgreSQL connected and ready');
}

init().catch((err: Error) => {
  console.error('[DB] Init failed:', err.message);
  process.exit(1);
});

export default pool;
