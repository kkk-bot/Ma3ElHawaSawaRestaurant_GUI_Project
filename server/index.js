// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// 1. Recreate __dirname (It doesn't exist in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Setup SQLite with verbose mode
const sqlite = sqlite3.verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const dbPath = path.resolve(__dirname, "../database/db.db");
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL
    )`);

    // 2. Menu Items Table
    db.run(
      `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      is_special INTEGER DEFAULT 0
    )`,
      (err) => {
        if (!err) {
          // Check for missing columns (Migration)
          db.all("PRAGMA table_info(menu_items)", (err, rows) => {
            if (!err && rows) {
              const hasIsSpecial = rows.some((r) => r.name === "is_special");
              if (!hasIsSpecial) {
                console.log(
                  "Migrating database: Adding is_special column to menu_items"
                );
                db.run(
                  "ALTER TABLE menu_items ADD COLUMN is_special INTEGER DEFAULT 0",
                  (err) => {
                    if (err)
                      console.error(
                        "Error adding is_special column:",
                        err.message
                      );
                  }
                );
              }
            }
          });
        }
      }
    );

    // 3. Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      is_delivery INTEGER NOT NULL,
      address TEXT,
      total REAL NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 4. Order Items Table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_order REAL NOT NULL,
      item_name_snapshot TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )`);

    // 5. About Us Content
    db.run(`CREATE TABLE IF NOT EXISTS about_us (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      story TEXT,
      usps TEXT,
      quality TEXT
    )`);

    // Initialize About Us if empty
    db.get("SELECT count(*) as count FROM about_us", (err, row) => {
      if (row && row.count === 0) {
        const initialAbout = {
          story:
            "تأسس مطعم 'مع الهوى سوا' من حب عميق للمطبخ الأردني الأصيل. بدأنا رحلتنا بهدف واحد بسيط: تقديم نكهات المنزل الدافئة في أجواء عصرية ومريحة. قصتنا هي قصة شغف بالتفاصيل، من اختيار حبة الهيل وحتى تقديم الطبق بابتسامة.",
          usps: "نتميز بتقديم المأكولات التقليدية بلمسة عصرية، ونفخر باستخدامنا للسمن البلدي الأصلي وزيت الزيتون البكر. أجواؤنا العائلية وخدمتنا المميزة تجعل من كل زيارة ذكرى لا تنسى.",
          quality:
            "الجودة ليست مجرد شعار لدينا، بل هي أسلوب حياة. نختار خضرواتنا ولحومنا يومياً من أفضل المزارع المحلية لضمان الطزاجة والنكهة. مطبخنا يلتزم بأعلى معايير النظافة وسلامة الغذاء.",
        };
        db.run(
          `INSERT INTO about_us (id, story, usps, quality) VALUES (1, ?, ?, ?)`,
          [initialAbout.story, initialAbout.usps, initialAbout.quality]
        );
      }
    });
  });
}

// --- API Endpoints ---

// Get Menu
app.get("/api/menu", (req, res) => {
  db.all("SELECT * FROM menu_items", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Convert is_special from 0/1 to boolean
    const menu = rows.map((item) => ({
      ...item,
      isSpecial: item.is_special === 1,
    }));
    res.json(menu);
  });
});

// Add Menu Item
app.post("/api/menu", (req, res) => {
  console.log("Received add menu item request:", req.body);
  const { name, description, price, image, isSpecial } = req.body;

  if (!name || price === undefined || price === null) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const is_special = isSpecial ? 1 : 0;
  const sql = `INSERT INTO menu_items (name, description, price, image, is_special) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, description, price, image, is_special], function (err) {
    if (err) {
      console.error("Error adding menu item:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, description, price, image, isSpecial });
  });
});

// Update Menu Item
app.put("/api/menu/:id", (req, res) => {
  const { name, description, price, image, isSpecial } = req.body;
  const id = req.params.id;
  const is_special = isSpecial ? 1 : 0;

  const sql = `UPDATE menu_items SET name = ?, description = ?, price = ?, image = ?, is_special = ? WHERE id = ?`;
  db.run(
    sql,
    [name, description, price, image, is_special, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", changes: this.changes });
    }
  );
});

// Delete Menu Item
app.delete("/api/menu/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM menu_items WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted", changes: this.changes });
  });
});

// Get Orders
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.*, 
           oi.menu_item_id, oi.quantity, oi.price_at_order, oi.item_name_snapshot
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Group by order
    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.user_id,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          isDelivery: row.is_delivery === 1,
          address: row.address,
          total: row.total,
          date: row.created_at,
          items: [],
        };
      }
      if (row.menu_item_id) {
        ordersMap[row.id].items.push({
          menuItemId: row.menu_item_id,
          quantity: row.quantity,
          price: row.price_at_order,
          name: row.item_name_snapshot,
        });
      }
    });

    res.json(Object.values(ordersMap));
  });
});

// Place Order
app.post("/api/orders", (req, res) => {
  const {
    userId,
    customerName,
    customerPhone,
    isDelivery,
    address,
    total,
    items,
  } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  const created_at = new Date().toISOString();
  const is_delivery = isDelivery ? 1 : 0;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const sqlOrder = `INSERT INTO orders (id, user_id, customer_name, customer_phone, is_delivery, address, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      sqlOrder,
      [
        id,
        userId,
        customerName,
        customerPhone,
        is_delivery,
        address,
        total,
        created_at,
      ],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        const sqlItem = `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order, item_name_snapshot) VALUES (?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sqlItem);

        for (const item of items) {
          const menuItemId = item.menuItemId || item.id;
          if (!menuItemId) {
            console.error("Missing menu item ID for item:", item);
            continue;
          }
          stmt.run(
            id,
            menuItemId,
            item.quantity,
            item.price,
            item.name,
            (err) => {
              if (err) console.error("Error inserting order item:", err);
            }
          );
        }

        stmt.finalize((err) => {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
          }
          db.run("COMMIT");
          res.json({
            id,
            userId,
            customerName,
            customerPhone,
            isDelivery,
            address,
            total,
            date: created_at,
            items,
          });
        });
      }
    );
  });
});

// Get About
app.get("/api/about", (req, res) => {
  db.get("SELECT * FROM about_us WHERE id = 1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

// Update About
app.put("/api/about", (req, res) => {
  const { story, usps, quality } = req.body;
  db.run(
    "UPDATE about_us SET story = ?, usps = ?, quality = ? WHERE id = 1",
    [story, usps, quality],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Auth: Register
app.post("/api/auth/register", (req, res) => {
  console.log("Register request received:", req.body);
  const { username, password, fullName, phone } = req.body;

  if (!username || !password || !fullName || !phone) {
    console.error("Missing fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = Math.random().toString(36).substr(2, 9);

  db.run(
    "INSERT INTO users (id, username, password, full_name, phone) VALUES (?, ?, ?, ?, ?)",
    [id, username, password, fullName, phone],
    function (err) {
      if (err) {
        console.error("Database error during registration:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "اسم المستخدم مسجل مسبقاً" });
        }
        return res.status(500).json({ error: err.message });
      }
      console.log("User registered successfully:", id);
      res.json({ id, username, fullName, phone });
    }
  );
});

// Auth: Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT id, username, full_name, phone, is_admin FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: "Invalid credentials" });
      res.json({
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        phone: row.phone,
        is_admin: row.is_admin === 1,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
