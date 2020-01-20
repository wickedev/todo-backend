import http, { Server } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import { Repository } from 'typeorm'
// @ts-ignore
import aduit from 'express-requests-logger'
import { getTodoRepository } from '~/todo-repository'
import { TodoItem } from '~/todo-entity'
import { wrapAsync } from '~/utils'

const port = process.env.PORT || 3000

export class Application {
    public static bootstrap(): Promise<Application> {
        return (async () => {
            const todoRepository = await getTodoRepository()
            return new Application(todoRepository)
        })()
    }

    private readonly app: express.Application

    constructor(private readonly todoRepository: Repository<TodoItem>) {
        this.app = express()
            .use(aduit())
            .use(bodyParser.json())
            .get('/todos', wrapAsync(this.getTodos))
            .get('/todo/:id', wrapAsync(this.getTodo))
            .post('/todo', wrapAsync(this.createTodo))
            .patch('/todo/:id', wrapAsync(this.updateTodo))
            .delete('/todo/:id', wrapAsync(this.deleteTodo))
            .use(this.errorHandler)
    }

    private createTodo = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const { title } = req.body
        const todo = TodoItem.create(title)
        const result = await this.todoRepository.save(todo)
        res.json(result)
    }

    private getTodos = async (req: express.Request, res: express.Response) => {
        const result = await this.todoRepository.find()
        res.json(result)
    }

    private getTodo = async (req: express.Request, res: express.Response) => {
        const id = req.params.id
        const result = await this.todoRepository.findOne(id)

        if (!result) {
            res.status(500).json({ message: `[${id}] todo item not exist` })
            return
        }

        res.json(result)
    }

    private updateTodo = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const id = req.params.id
        const todo = req.body
        const result = await this.todoRepository.update(id, todo)
        res.json(result)
    }

    private deleteTodo = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const id = req.params.id
        const result = await this.todoRepository.delete(id)
        res.json(result)
    }

    private errorHandler = (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        res.status(500).json({ message: error.message })
    }

    public start() {
        this.app.listen(port, () =>
            console.log(`todo api server listening on port ${port}!`),
        )
    }
}