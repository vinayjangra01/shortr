import express from 'express'
import dotenv from 'dotenv';


dotenv.config(); // 👈 loads variables from .env into process.env
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/heahth", (req, res) => {
    res.send("Health is okay");
})



app.post("/api/create", (req, res) =>   {
    const url = req.body
    console.log(url);
    res.send("hello world")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})

//GET -> redirection
//POST -> create short URL