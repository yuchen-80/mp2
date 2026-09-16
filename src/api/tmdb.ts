import axios from 'axios'
import type { Genre, Movie, MovieDetails } from '../types'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
  },
})

interface PagedResponse<T> {
  results: T[]
  page: number
  total_pages: number
}

// Popular movies are paginated (20 per page); pulling a handful of pages
// gives us a large enough local dataset to search/sort/filter client-side
// without re-hitting the API on every keystroke (also helps with rate limits).
export async function fetchPopularMovies(pageCount = 5): Promise<Movie[]> {
  const pages = await Promise.all(
    Array.from({ length: pageCount }, (_, i) =>
      client.get<PagedResponse<Movie>>('/movie/popular', {
        params: { page: i + 1 },
      }),
    ),
  )
  return pages.flatMap((res) => res.data.results)
}

export async function fetchGenres(): Promise<Genre[]> {
  const res = await client.get<{ genres: Genre[] }>('/genre/movie/list')
  return res.data.genres
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const res = await client.get<MovieDetails>(`/movie/${id}`)
  return res.data
}

export function posterUrl(path: string | null, size: 'w342' | 'w500' = 'w342') {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}
