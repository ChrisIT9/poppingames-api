export interface User {
    username: string,
    password: string,
    isAdmin: boolean
}

export interface ReviewInterface {
    gameId: string,
    reviewedBy: string,
    rating: number,
    reviewContent: string,
    time: Date
}