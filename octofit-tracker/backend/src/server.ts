import express from 'express';
import db from './config/database';
import { Activity } from './models/Activity';
import { User } from './models/User';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/config', (_request, response) => {
  response.json({
    apiBaseUrl,
    codespaceName: codespaceName ?? null,
    port,
  });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiBaseUrl });
});

app.get('/api/users', async (_request, response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    response.json(users);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch users', error: String(error) });
  }
});

app.get('/api/activities', async (_request, response) => {
  try {
    const activities = await Activity.find().populate('user').sort({ completedAt: -1 }).lean();
    response.json(activities);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch activities', error: String(error) });
  }
});

export const startServer = () => {
  app.listen(port, () => {
    console.log(`Octofit API listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
    db.on('connected', () => console.log('MongoDB connected'));
  });
  return app;
};

export default app;
