const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const users = [
  {
    id: '1',
    email: 'admin@crowdguard.com',
    password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQj', // admin123
    role: 'admin',
    organizationId: '1'
  }
];

const venues = [
  {
    id: '1',
    organizationId: '1',
    name: 'Madison Square Garden',
    mapImageUrl: '/images/msg-floor-plan.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    organizationId: '1',
    name: 'Central Park Arena',
    mapImageUrl: '/images/cpa-floor-plan.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const zones = [
  {
    id: '1',
    venueId: '1',
    name: 'Main Entrance',
    coordinates: { x: 100, y: 50, width: 200, height: 150 },
    maxCapacity: 500,
    alertThreshold: 400
  },
  {
    id: '2',
    venueId: '1',
    name: 'Concourse Level 1',
    coordinates: { x: 350, y: 100, width: 300, height: 200 },
    maxCapacity: 800,
    alertThreshold: 650
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, organizationName } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password: hashedPassword,
    role: 'admin',
    organizationId: '1'
  };
  
  users.push(newUser);
  
  const accessToken = jwt.sign(
    { userId: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: newUser.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    accessToken,
    refreshToken,
    user: { id: newUser.id, email: newUser.email, role: newUser.role }
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const accessToken = jwt.sign(
      { userId: user.userId },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken, refreshToken });
  });
});

// Protected routes
app.get('/api/venues', authenticateToken, (req, res) => {
  const userVenues = venues.filter(v => v.organizationId === req.user.organizationId);
  res.json(userVenues);
});

app.get('/api/venues/:id/zones', authenticateToken, (req, res) => {
  const venueZones = zones.filter(z => z.venueId === req.params.id);
  res.json(venueZones);
});

app.get('/api/analytics/:venueId', authenticateToken, (req, res) => {
  // Generate mock analytics data
  const analytics = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    analytics.push({
      timestamp,
      totalPeople: Math.floor(Math.random() * 3000) + 500,
      avgDensity: (Math.random() * 2 + 0.5).toFixed(2),
      peakZones: ['1', '2'],
      alertsCount: Math.floor(Math.random() * 5)
    });
  }
  
  res.json(analytics);
});

// WebSocket for real-time updates
wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');
  
  // Send real-time crowd data every 2 seconds
  const interval = setInterval(() => {
    const crowdData = zones.map(zone => ({
      zoneId: zone.id,
      count: Math.floor(Math.random() * zone.maxCapacity),
      density: (Math.random() * 5).toFixed(2),
      riskLevel: ['safe', 'moderate', 'high', 'critical'][Math.floor(Math.random() * 4)]
    }));
    
    ws.send(JSON.stringify({
      type: 'crowd_update',
      data: crowdData,
      timestamp: new Date()
    }));
  }, 2000);
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
