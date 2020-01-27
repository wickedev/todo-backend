import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ToDoItem } from '~/todo-entity'

@Entity()
export class ToDoTable extends ToDoItem {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    completed!: boolean
}
