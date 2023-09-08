import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import bodyParser from 'body-parser'
import router from './src/routes/index.js'
import Engine from './src/utils/engine.js'
import database from './src/db/index.js'

class App {
    constructor() {
        dotenv.config()
        Engine.loading()
            .then(() => express())
            .then((app) => this.dbConfiguration(app))
            .then((app) => {
                console.log('2. server configuration completed.')
                return this.configureServer(app)
            })
            .then((app) => {
                console.log('3. server starting.')
                return this.startServer(app)
            })
    }

    configureServer = () => new Promise((resolve) => {
            const app = express()
            app.use(cors())
            app.use(express.json())
            app.use(express.urlencoded({ extended: true }))
            app.use(bodyParser.urlencoded({ extended: false }))
            app.use('/api/v1', router)
            resolve(app)
        })

    startServer = (app) => new Promise((resolve) => {
            const port = process.env.PORT || 4000
            app.set(port)
            const server = http.createServer(app)
            server.on('listening', () => {
                const PORT = server.address().port
                console.log('4. server started on:', `http://localhost:${PORT}/api/v1`)
                resolve(server)
            })
            server.listen(port)
        })

    dbConfiguration = async (app) => {
        try {
            await database.connection().then(() => {
                console.log('1. database connected.')
                return app
            })
        } catch (error) {
            console.log('error', error)
        }
    }
}
export default new App()