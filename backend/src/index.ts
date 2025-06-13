import app from './server';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🎾 Tennis Service Analyzer API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app; 