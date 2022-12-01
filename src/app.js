import express from "express";
import authController from './controllers/authController.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(authController)

export default app