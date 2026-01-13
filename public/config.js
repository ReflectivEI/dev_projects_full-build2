// ReflectivAI Configuration
// This ensures the frontend knows where the backend worker is
window.REFLECTIVAI_CONFIG = {
  WORKER_URL: 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev',
  VERSION: '1.0.0',
  ENVIRONMENT: 'production'
};

console.log('[ReflectivAI] Config loaded:', window.REFLECTIVAI_CONFIG);
