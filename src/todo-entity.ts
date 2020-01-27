export abstract class ToDoItem {
    public static create(title: string): ToDoItem {
        return new (class extends ToDoItem {
            id: number = 0
            title: string = title
            completed: boolean = false
        })()
    }

    abstract id: number

    abstract title: string

    abstract completed: boolean
}
