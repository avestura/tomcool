export type Reply = {
    hash: string,
    text: string,
    created?: string
}

export type RecentThread = {
    id: number,
    created: string,
    modified: string,
    hash: string,
    title: string,
    replies: number
}

export type Thread = {
    created: string,
    modified: string,
    hash: string,
    title: string,
    text: string,
    replies: Reply[]
}

export type Board = {
    name: string,
    description: string,
    expiry: number
}

export type ThomasResponse<T extends object> = {
    ok: boolean
    error: string,
} & T;

export type ThreadResponse = ThomasResponse<{thread: Thread}>

export type RecentThreadResponse = ThomasResponse<{threads: RecentThread[]}>

export type BoardsResponse = ThomasResponse<{boards: Board[]}>

export type BoradRecentThreadsResponse = ThomasResponse<{board: Board, threads: RecentThread[]}>