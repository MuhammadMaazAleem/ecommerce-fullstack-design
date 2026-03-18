const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
require('dotenv').config();
const connectDB = require('./config/db');
const ensureSeedData = require('./seed/ensureSeedData');
const ensureAdminUser = require('./seed/ensureAdminUser');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    const result = await ensureSeedData();
    const adminResult = await ensureAdminUser();

    if (!result.skipped) {
      console.log(`Auto-seeded products: ${result.inserted}`);
    }

    if (adminResult.created) {
      console.log('Admin user created from environment variables');
    } else if (adminResult.promoted) {
      console.log('Existing user promoted to admin from environment variables');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://localhost:5174',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'eCommerce API running',
    data: null,
  });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

startServer();
