const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'ava.db')

let db = null

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
  }
  return db
}

function initDatabase() {
  const db = getDb()

  // Salons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS salons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      postal_code TEXT,
      iban TEXT,
      bic TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      max_chars INTEGER DEFAULT 15,
      model_color TEXT,
      in_stock INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      salon_id TEXT,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      delivery_type TEXT NOT NULL,
      delivery_address TEXT,
      delivery_city TEXT,
      delivery_postal_code TEXT,
      relay_point_id TEXT,
      subtotal REAL NOT NULL,
      delivery_cost REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      payment_intent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (salon_id) REFERENCES salons(id)
    )
  `)

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      custom_text TEXT NOT NULL,
      font TEXT NOT NULL,
      color TEXT NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `)

  // Commissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      salon_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payout_id TEXT,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (salon_id) REFERENCES salons(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `)

  // Payouts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payouts (
      id TEXT PRIMARY KEY,
      salon_id TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (salon_id) REFERENCES salons(id)
    )
  `)

  // Insert default admin
  const adminExists = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@ava-bijoux.fr')
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    db.prepare(`
      INSERT INTO admins (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin_1', 'Administrateur', 'admin@ava-bijoux.fr', hashedPassword, 'superadmin')
    console.log('✅ Default admin created: admin@ava-bijoux.fr / admin123')
  }

  // Insert default products
  const productsExist = db.prepare('SELECT id FROM products LIMIT 1').get()
  if (!productsExist) {
    const products = [
      { id: 'collier-plaque-or', name: 'Collier Plaque Or', category: 'colliers', price: 39.90, description: 'Élégant collier avec plaque rectangulaire personnalisable, plaqué or 18 carats.', max_chars: 12, model_color: '#d4af37' },
      { id: 'collier-medaillon-coeur', name: 'Médaillon Cœur', category: 'colliers', price: 34.90, description: 'Délicat médaillon en forme de cœur à personnaliser. Plaqué or rose.', max_chars: 8, model_color: '#e8c4c4' },
      { id: 'collier-barre-argent', name: 'Collier Barre Argent', category: 'colliers', price: 32.90, description: 'Collier minimaliste avec barre horizontale gravable. Argent 925.', max_chars: 15, model_color: '#c0c0c0' },
      { id: 'bracelet-jonc-or', name: 'Jonc Personnalisé Or', category: 'bracelets', price: 44.90, description: 'Bracelet jonc ouvert à graver sur le dessus. Plaqué or 18 carats.', max_chars: 10, model_color: '#d4af37' },
      { id: 'bracelet-chaine-plaque', name: 'Bracelet Chaîne Plaque', category: 'bracelets', price: 36.90, description: 'Bracelet chaîne fine avec plaque centrale personnalisable.', max_chars: 12, model_color: '#d4af37' },
      { id: 'bracelet-cuir-argent', name: 'Bracelet Cuir & Argent', category: 'bracelets', price: 42.90, description: 'Bracelet en cuir véritable avec plaque argent 925 à personnaliser.', max_chars: 10, model_color: '#c0c0c0' },
    ]

    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, category, price, description, max_chars, model_color)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const p of products) {
      insertProduct.run(p.id, p.name, p.category, p.price, p.description, p.max_chars, p.model_color)
    }
    console.log('✅ Default products created')
  }

  // Insert demo salons
  const salonsExist = db.prepare('SELECT id FROM salons LIMIT 1').get()
  if (!salonsExist) {
    const hashedPassword = bcrypt.hashSync('salon123', 10)
    const demoSalons = [
      { id: 'rec8aa6Ye7f4h2Zjl', name: 'Salon Marie Coiffure', email: 'marie@salonmarie.fr', city: 'Paris' },
      { id: 'rec9bb7Zf8g5i3Akm', name: 'Coiff & Style', email: 'contact@coiffstyle.fr', city: 'Lyon' },
      { id: 'rec0cc8Ah9h6j4Bln', name: 'Hair Beauté', email: 'hello@hairbeaute.fr', city: 'Marseille' },
    ]

    const insertSalon = db.prepare(`
      INSERT INTO salons (id, name, email, password_hash, city)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const s of demoSalons) {
      insertSalon.run(s.id, s.name, s.email, hashedPassword, s.city)
    }
    console.log('✅ Demo salons created (password: salon123)')
  }

  console.log('✅ Database initialized')
}

module.exports = { getDb, initDatabase }
