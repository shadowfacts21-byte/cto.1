const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const billingRoutes = require('./routes/billingRoutes');
const timeRoutes = require('./routes/timeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const automationRoutes = require('./routes/automationRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const guestRoutes = require('./routes/guestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(cors());

// Use billing routes BEFORE express.json() to allow for raw body on webhooks
app.use('/api/billing', billingRoutes);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
