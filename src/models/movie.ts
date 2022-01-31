import { ObjectId } from 'mongodb'

export default interface Movie {
        title: string,
        overview: string,
        releaseDate: number,
        rate: number,
        poster: string,
        id?: ObjectId
}
