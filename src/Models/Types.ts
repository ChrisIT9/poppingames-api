export interface User {
    username: string,
    password: string,
    isAdmin: boolean
}

export interface ReviewInterface {
    _id: string,
    gameId: string,
    reviewedBy: string,
    rating: number,
    reviewContent: string,
    time: Date
}