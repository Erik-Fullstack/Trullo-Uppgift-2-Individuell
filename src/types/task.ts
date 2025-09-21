enum Status {
    //mapped in prisma schema to real names
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    DONE = "DONE"
}

export type Task = {
    title: string,
    description: string,
    status?: Status
}