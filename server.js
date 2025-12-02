import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import logger from './config/logger.js'

const app =  express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false, 
});


app.use(limiter)
app.use(cors())
app.use(express.json())


app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
)



