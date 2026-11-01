const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({ service: 'webhook-ingest-service', ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
