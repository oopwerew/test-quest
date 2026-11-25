import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import 'dotenv/config';
import { pool, checkConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/meta', async (req, res, next) => {
  try {
    const [departments] = await pool.query('SELECT id, name FROM departments ORDER BY name ASC');
    const [positions] = await pool.query('SELECT id, name FROM positions ORDER BY name ASC');
    res.json({ departments, positions });
  } catch (error) {
    next(error);
  }
});

app.get('/api/employees', async (req, res, next) => {
  try {
    const [employees] = await pool.query(`
      SELECT
        e.id,
        e.full_name,
        e.birth_date,
        e.passport,
        e.phone,
        e.address,
        e.department_id,
        d.name AS department_name,
        e.position_id,
        p.name AS position_name,
        e.salary,
        e.hire_date,
        e.is_fired,
        e.fired_at,
        e.created_at,
        e.updated_at
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      JOIN positions p ON e.position_id = p.id
      ORDER BY e.is_fired ASC, e.full_name ASC
    `);
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

async function start() {
  try {
    await checkConnection();
    console.log('Подключение к MySQL успешно установлено');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    process.exit(1);
  }
}

start();
