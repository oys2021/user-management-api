import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import logger from './config/logger.js'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sessionMiddleware from './config/session.js';
import { testConnection } from './config/database.js';
import { syncModels } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.join(__dirname, 'docs', 'swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

dotenv.config();

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

app.use(limiter)
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
)

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    session: !!req.sessionID
  });
});

app.use('/api/auth', authRoutes);

(async () => {
  try {
    await testConnection();
    await syncModels(false); 
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
})();

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});