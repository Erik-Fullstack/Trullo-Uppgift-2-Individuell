export enum Role {
    ADMIN,
    MEMBER
}

export type User = {
    name: string,
    email: string,
    password: string
}