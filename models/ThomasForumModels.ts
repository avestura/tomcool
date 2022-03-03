export type Reply = {
    hash: string,
    text: string
}

export type RecentThread = {
    id: number,
    created: string,
    modified: string,
    hash: string,
    title: string,
}

export type Thread = {
    created: string,
    modified: string,
    hash: string,
    title: string,
    text: string,
    replies: Reply[]
}

export type ThreadResponse = {
    ok: boolean,
    error: string,
    thread: Thread
}

export type RecentThreadResponse = {
    ok: boolean,
    error: string,
    threads: RecentThread[]
}