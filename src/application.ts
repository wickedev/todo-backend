import express from 'express'
import bodyParser from 'body-parser'
import { Repository } from 'typeorm'
import aduit from 'express-requests-logger'
import { getToDoRepository } from '~/todo-repository'
import { ToDoItem } from '~/todo-entity'
import { wrapAsync } from '~/utils'

const port = process.env.PORT || 3000

export class Application {
    public static bootstrap(): Promise<Application> {
        return (async () => {
            const todoRepository = await getToDoRepository()
            return new Application(todoRepository)
        })()
    }

    private readonly app: express.Application

    constructor(private readonly todoRepository: Repository<ToDoItem>) {
        this.app = express()
            .use(aduit())
            .use(bodyParser.json())
            .get('/todos', wrapAsync(this.getToDos))
            .get('/todo/:id', wrapAsync(this.getToDo))
            .post('/todo', wrapAsync(this.createToDo))
            .patch('/todo/:id', wrapAsync(this.updateToDo))
            .delete('/todo/:id', wrapAsync(this.deleteToDo))
            .use(this.errorHandler)
    }

    private createToDo = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const { title } = req.body
        const todo = ToDoItem.create(title)
        const result = await this.todoRepository.save(todo)
        res.json(result)
    }

    private getToDos = async (req: express.Request, res: express.Response) => {
        const result = await this.todoRepository.find({
            order: {
                id: 'ASC',
            },
        })
        res.json(result)
    }

    private getToDo = async (req: express.Request, res: express.Response) => {
        const id = req.params.id
        const result = await this.todoRepository.findOne(id)

        if (!result) {
            res.status(500).json({ message: `[${id}] todo item not exist` })
            return
        }

        res.json(result)
    }

    private updateToDo = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const id = req.params.id
        const todo = req.body
        const result = await this.todoRepository.update(id, todo)
        res.json(result)
    }

    private deleteToDo = async (
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
    ) => {
        res.status(500).json({ message: error.message })
    }

    public start() {
        this.app.listen(port, () =>
            console.log(`todo api server listening on port ${port}!`),
        )
    }
}
