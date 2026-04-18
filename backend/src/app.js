require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const collegeRoutes = require('./routes/college.routes');
const eventRoutes = require('./routes/event.routes');
const applicationRoutes = require('./routes/application.routes');
const conversationRoutes = require('./routes/conversation.routes');
const proofRoutes = require('./routes/proof.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'backend/uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Active8 API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/proofs', proofRoutes);

app.use(errorHandler);

module.exports = app;
