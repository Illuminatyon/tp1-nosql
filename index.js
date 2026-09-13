import express from 'express';
import dotenv from 'dotenv';

// Le chemin pour les routes
import routeBlog from './routes/blogs.js';
import routeUser from './routes/users.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();
connectDB()
app.use(express.json());
app.use('/users/', routeUser);
app.use('/blogs/', routeBlog);

app.listen(PORT, () => 
	console.log("App started on port" + PORT)
);
