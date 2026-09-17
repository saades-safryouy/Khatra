const app = require('./src/app');
const prisma = require('./src/config/database');
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Khatra API running on port ${PORT}`));
process.on('SIGINT', async () => { await prisma.$disconnect(); server.close(() => process.exit(0)); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); server.close(() => process.exit(0)); });
