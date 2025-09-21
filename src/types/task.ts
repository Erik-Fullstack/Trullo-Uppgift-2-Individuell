enum Status {
    TODO = "to-do",
    IN_PROGRESS = "in progress",
    BLOCKED = "blocked",
    DONE = "done"
}

export type Task = {
    title: string,
    description: string,
    status?: Status
}