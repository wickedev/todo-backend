import { createConnection, Repository } from 'typeorm'
import { TodoTable } from '~/todo-table'
import { TodoItem } from '~/todo-entity'

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
    entities: [TodoTable],
    synchronize: true,
    logging: isDevMode,
})

export async function getTodoRepository(): Promise<Repository<TodoItem>> {
    const conn = await connection
    return conn.getRepository(TodoTable)
}
