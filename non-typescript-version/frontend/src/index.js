import express from 'express';
import cors from 'cors';
// routes
import fileRoutes from './routes/files';

const app = express();

const PORT = 3000;

app.use(cors())
app.use(express.json());

app.use('/files', fileRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  app.emit('app_started');
});

export { app };
