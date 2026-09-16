export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  runtime: number
  tagline: string
  genres: Genre[]
}

export type SortKey = 'title' | 'release_date' | 'vote_average' | 'popularity'
export type SortDirection = 'asc' | 'desc'
