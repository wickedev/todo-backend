export abstract class TodoItem {
    public static create(title: string): TodoItem {
        return new (class extends TodoItem {
            id: number = 0
            title: string = title
            completed: boolean = false
        })()
    }

    abstract id: number

    abstract title: string

    abstract completed: boolean
}
