import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.json('Server ON');
});

export default app;
