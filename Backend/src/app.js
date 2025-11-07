import express from "express";
import helmet from 'helmet';
import cors from 'cors';
import config from './config/env.js'
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import UrlController from './controllers/urlController.js'
import {errorHandler, notFound} from './middlewares/errorHandler.js';
import { apiLimiter } from "./middlewares/rateLimiter.js";


const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));


// rate limiting to all API routes
app.use('/api', apiLimiter);


app.get("/health", (req, res) => {
    res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
})

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

app.get("/:shortUrl", UrlController.redirectUrl);

//no route matches
app.use(notFound);
//in case of some error thrown from any route controller
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Base URL: ${config.baseUrl}`);
});

//GET -> redirection
//POST -> create short URL
// Requests travel top to bottom in your code.

// Each middleware or route handler is run in order.

// If none of them send a response (res.send, res.json, res.redirect, etc.), Express continues to the next one.

// If any middleware throws an error or calls next(err), Express skips all remaining normal middlewares and jumps directly to an error-handling middleware (a function with 4 parameters: err, req, res, next).