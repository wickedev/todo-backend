import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { TodoItem } from '~/todo-entity'

@Entity()
export class TodoTable extends TodoItem {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    completed!: boolean
}
