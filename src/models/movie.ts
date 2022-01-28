import { ObjectId } from "mongodb"

export default interface Movie {
        title: string,
        overview: string,
        release_date: number,
        rate: number,
        poster_path: string,
        id?: ObjectId
}
