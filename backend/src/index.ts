import { createApp } from './api/app.js';

const port = 3000;
createApp().listen(port, () => {
  console.log(`API запущен: http://localhost:${port}/api`);
});
