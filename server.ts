import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

console.log("--- SERVER STARTING ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CWD:", process.cwd());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const dbPath = path.resolve(__dirname, "surat.db");
  console.log(`Using database at: ${dbPath}`);
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  // Integrity Check
  try {
    const integrity = db.prepare("PRAGMA integrity_check").get();
    console.log("Database integrity check:", integrity);
  } catch (err) {
    console.error("Database integrity check failed:", err);
  }

  // Ensure uploads directory exists
  const uploadDir = path.resolve(__dirname, "uploads");
  console.log(`Checking uploads directory: ${uploadDir}`);
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created uploads directory");
    }
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log(`Uploads directory is writable`);
  } catch (err) {
    console.error(`Uploads directory error:`, err);
  }

  // Check DB writability
  try {
    fs.accessSync(".", fs.constants.W_OK);
    console.log("Current directory is writable");
  } catch (err) {
    console.error("Current directory is NOT writable");
  }

  // Configure Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });

  db.exec(`
    CREATE TABLE IF NOT EXISTS surat_masuk (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      no_agenda TEXT,
      no_surat TEXT,
      tgl_surat TEXT,
      tgl_diterima TEXT,
      asal_surat TEXT,
      perihal TEXT,
      keterangan TEXT,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS disposisi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surat_id INTEGER,
      tujuan TEXT,
      isi TEXT,
      sifat TEXT,
      batas_waktu TEXT,
      catatan TEXT,
      FOREIGN KEY (surat_id) REFERENCES surat_masuk(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS agenda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_kegiatan TEXT,
      tanggal TEXT,
      waktu TEXT,
      lokasi TEXT,
      keterangan TEXT,
      pelaksana TEXT
    );

    CREATE TABLE IF NOT EXISTS agenda_kepala (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_kegiatan TEXT,
      tanggal TEXT,
      waktu TEXT,
      lokasi TEXT,
      keterangan TEXT
    );
  `);

  // Migration: Add columns if they don't exist
  const migrations = [
    { table: "surat_masuk", column: "file_path", type: "TEXT" },
    { table: "surat_masuk", column: "keterangan", type: "TEXT" },
    { table: "disposisi", column: "catatan", type: "TEXT" },
    { table: "agenda", column: "pelaksana", type: "TEXT" }
  ];

  for (const m of migrations) {
    try {
      db.prepare(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.type}`).run();
    } catch (e) {
      // Column already exists
    }
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use("/uploads", express.static(uploadDir));

  // Request logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    console.log("Health check requested");
    res.json({ 
      status: "ok", 
      database: "connected",
      env: process.env.NODE_ENV || "development",
      time: new Date().toISOString()
    });
  });

  app.get("/api/debug", (req, res) => {
    res.json({
      dirname: __dirname,
      existsDist: fs.existsSync(path.join(__dirname, "dist")),
      existsUploads: fs.existsSync(uploadDir),
      cwd: process.cwd()
    });
  });

  // Surat Masuk
  app.get("/api/surat-masuk", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM surat_masuk ORDER BY created_at DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: `DB Error: ${err.message}` });
    }
  });

  app.post("/api/surat-masuk", (req, res) => {
    const payloadSize = JSON.stringify(req.body).length;
    console.log(`POST /api/surat-masuk - Received request, payload size: ${payloadSize} bytes`);
    try {
      const { no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, fileData, fileName } = req.body;
      
      let file_path = null;
      if (fileData && fileName) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const savedFileName = uniqueSuffix + "-" + fileName;
        const fullPath = path.join(uploadDir, savedFileName);
        
        // Remove header if present (e.g., data:image/png;base64,)
        const base64Data = fileData.replace(/^data:.*?;base64,/, "");
        fs.writeFileSync(fullPath, base64Data, 'base64');
        file_path = `/uploads/${savedFileName}`;
      }
      
      const info = db.prepare(`
        INSERT INTO surat_masuk (no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, file_path);
      
      res.json({ id: info.lastInsertRowid });
    } catch (error: any) {
      console.error("Error saving surat-masuk:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.put("/api/surat-masuk/:id", (req, res) => {
    console.log("PUT /api/surat-masuk - Received JSON request");
    try {
      const { no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, fileData, fileName } = req.body;
      const { id } = req.params;
      
      let file_path = null;
      if (fileData && fileName) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const savedFileName = uniqueSuffix + "-" + fileName;
        const fullPath = path.join(uploadDir, savedFileName);
        
        const base64Data = fileData.replace(/^data:.*?;base64,/, "");
        fs.writeFileSync(fullPath, base64Data, 'base64');
        file_path = `/uploads/${savedFileName}`;
      }
      
      if (file_path) {
        db.prepare(`
          UPDATE surat_masuk 
          SET no_agenda = ?, no_surat = ?, tgl_surat = ?, tgl_diterima = ?, asal_surat = ?, perihal = ?, keterangan = ?, file_path = ?
          WHERE id = ?
        `).run(no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, file_path, id);
      } else {
        db.prepare(`
          UPDATE surat_masuk 
          SET no_agenda = ?, no_surat = ?, tgl_surat = ?, tgl_diterima = ?, asal_surat = ?, perihal = ?, keterangan = ?
          WHERE id = ?
        `).run(no_agenda, no_surat, tgl_surat, tgl_diterima, asal_surat, perihal, keterangan, id);
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating surat-masuk:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.delete("/api/surat-masuk/:id", (req, res) => {
    db.prepare("DELETE FROM surat_masuk WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Disposisi
  app.get("/api/disposisi", (req, res) => {
    const rows = db.prepare(`
      SELECT d.*, s.no_surat, s.perihal 
      FROM disposisi d 
      JOIN surat_masuk s ON d.surat_id = s.id
    `).all();
    res.json(rows);
  });

  app.get("/api/disposisi/:suratId", (req, res) => {
    const rows = db.prepare("SELECT * FROM disposisi WHERE surat_id = ?").all(req.params.suratId);
    res.json(rows);
  });

  app.post("/api/disposisi", (req, res) => {
    try {
      const { surat_id, tujuan, isi, sifat, batas_waktu, catatan } = req.body;
      const info = db.prepare(`
        INSERT INTO disposisi (surat_id, tujuan, isi, sifat, batas_waktu, catatan)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(surat_id, tujuan, isi, sifat, batas_waktu, catatan);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error("Error saving disposisi:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/api/disposisi/:id", (req, res) => {
    try {
      const { surat_id, tujuan, isi, sifat, batas_waktu, catatan } = req.body;
      db.prepare(`
        UPDATE disposisi 
        SET surat_id = ?, tujuan = ?, isi = ?, sifat = ?, batas_waktu = ?, catatan = ?
        WHERE id = ?
      `).run(surat_id, tujuan, isi, sifat, batas_waktu, catatan, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating disposisi:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/api/disposisi/:id", (req, res) => {
    db.prepare("DELETE FROM disposisi WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Search Surat
  app.get("/api/search-surat", (req, res) => {
    const q = req.query.q || "";
    const rows = db.prepare(`
      SELECT * FROM surat_masuk 
      WHERE no_surat LIKE ? OR perihal LIKE ? OR asal_surat LIKE ? OR no_agenda LIKE ?
      ORDER BY created_at DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    res.json(rows);
  });

  // Agenda
  app.get("/api/agenda", (req, res) => {
    const rows = db.prepare("SELECT * FROM agenda ORDER BY tanggal ASC").all();
    res.json(rows);
  });

  app.post("/api/agenda", (req, res) => {
    try {
      const { nama_kegiatan, tanggal, waktu, lokasi, keterangan, pelaksana } = req.body;
      const info = db.prepare(`
        INSERT INTO agenda (nama_kegiatan, tanggal, waktu, lokasi, keterangan, pelaksana)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(nama_kegiatan, tanggal, waktu, lokasi, keterangan, pelaksana);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error("Error saving agenda:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/api/agenda/:id", (req, res) => {
    try {
      const { nama_kegiatan, tanggal, waktu, lokasi, keterangan, pelaksana } = req.body;
      db.prepare(`
        UPDATE agenda 
        SET nama_kegiatan = ?, tanggal = ?, waktu = ?, lokasi = ?, keterangan = ?, pelaksana = ?
        WHERE id = ?
      `).run(nama_kegiatan, tanggal, waktu, lokasi, keterangan, pelaksana, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating agenda:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/api/agenda/:id", (req, res) => {
    db.prepare("DELETE FROM agenda WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Agenda Kepala Badan
  app.get("/api/agenda-kepala", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM agenda_kepala ORDER BY tanggal ASC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: `DB Error: ${err.message}` });
    }
  });

  app.post("/api/agenda-kepala", (req, res) => {
    try {
      const { nama_kegiatan, tanggal, waktu, lokasi, keterangan } = req.body;
      const info = db.prepare(`
        INSERT INTO agenda_kepala (nama_kegiatan, tanggal, waktu, lokasi, keterangan)
        VALUES (?, ?, ?, ?, ?)
      `).run(nama_kegiatan, tanggal, waktu, lokasi, keterangan);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error("Error saving agenda-kepala:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/api/agenda-kepala/:id", (req, res) => {
    try {
      const { nama_kegiatan, tanggal, waktu, lokasi, keterangan } = req.body;
      db.prepare(`
        UPDATE agenda_kepala 
        SET nama_kegiatan = ?, tanggal = ?, waktu = ?, lokasi = ?, keterangan = ?
        WHERE id = ?
      `).run(nama_kegiatan, tanggal, waktu, lokasi, keterangan, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating agenda-kepala:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/api/agenda-kepala/:id", (req, res) => {
    db.prepare("DELETE FROM agenda_kepala WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const suratCount = db.prepare("SELECT COUNT(*) as count FROM surat_masuk").get().count;
    const disposisiCount = db.prepare("SELECT COUNT(*) as count FROM disposisi").get().count;
    const agendaCount = db.prepare("SELECT COUNT(*) as count FROM agenda").get().count;
    const agendaKepalaCount = db.prepare("SELECT COUNT(*) as count FROM agenda_kepala").get().count;
    res.json({ suratCount, disposisiCount, agendaCount, agendaKepalaCount });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    console.log(`Starting in PRODUCTION mode, serving from: ${distPath}`);
    if (!fs.existsSync(distPath)) {
      console.error("CRITICAL: dist directory not found!");
    }
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
