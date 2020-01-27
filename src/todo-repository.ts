import { createConnection, Repository } from 'typeorm'
import { ToDoTable } from '~/todo-table'
import { ToDoItem } from '~/todo-entity'

const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development'
const isDevMode = mode === 'development'

export const connection = createConnection({
    type: 'postgres',
    host: process.env.DATABASE_POSTGRESQL_SERVICE_HOST || 'localhost',
    port: Number(process.env.DATABASE_POSTGRESQL_PORT) || 5432,
    database: process.env.DB_NAME || 'db_app',
    username: process.env.DB_USER || 'db_user',
    password: process.env.DB_PASSWORD,
    entities: [ToDoTable],
    synchronize: true,
    logging: isDevMode,
})

export async function getToDoRepository(): Promise<Repository<ToDoItem>> {
    const conn = await connection
    return conn.getRepository(ToDoTable)
}
