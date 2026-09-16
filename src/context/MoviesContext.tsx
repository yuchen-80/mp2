import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchGenres, fetchPopularMovies } from '../api/tmdb'
import type { Genre, Movie } from '../types'

interface MoviesContextValue {
  movies: Movie[]
  genres: Genre[]
  loading: boolean
  error: string | null
}

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined)

// Movies + genres are fetched once here and shared by the list/gallery/detail
// pages, so switching views or typing in the search box never re-hits the API.
export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [movieData, genreData] = await Promise.all([
          fetchPopularMovies(),
          fetchGenres(),
        ])
        if (cancelled) return
        setMovies(movieData)
        setGenres(genreData)
      } catch {
        if (!cancelled) {
          setError(
            'Failed to load movies from TMDB. Check that VITE_TMDB_API_KEY is set to a valid API key.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <MoviesContext.Provider value={{ movies, genres, loading, error }}>
      {children}
    </MoviesContext.Provider>
  )
}

export function useMovies() {
  const ctx = useContext(MoviesContext)
  if (!ctx) throw new Error('useMovies must be used within a MoviesProvider')
  return ctx
}
