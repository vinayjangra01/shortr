import express from 'express'
const app = express();

app.get("/", (res, req) =>   {
        res.send("Hello world")
})

app.listen(3000, () => {
    console.log("Server is running on port")
})