import express from 'express'
import dotenv from 'dotenv';
import { urlSchema } from './utils/validation.js';
import {nanoid} from 'nanoid'
import pool from './config/db.js';


dotenv.config();
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/health", (req, res) => {
    res.send("Health is okay");
})



app.post("/api/create", async (req, res) =>   {
    try{
        const validatedData = await urlSchema.validate(req.body);

        const {originalUrl, customUrl, userId, title} = validatedData;
        const shortId = nanoid(6);
        const shortUrl = `${process.env.BASE_URL}/${shortId}`;
        
        res.json({shortUrl: `${process.env.BASE_URL}/${shortId}`});
    }
    catch(error)
    {
        res.status(400).json({error: error.message});
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})

//GET -> redirection
//POST -> create short URL