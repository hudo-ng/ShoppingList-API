import express from "express"
import cors from "cors"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({}))


app.get("/", (req, res) => {
    res.send("Welcome to Spider Squad shopping list appp")
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))