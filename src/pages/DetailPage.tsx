import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchMovieDetails, posterUrl } from '../api/tmdb'
import { useMovies } from '../context/MoviesContext'
import type { MovieDetails } from '../types'
import styles from './DetailPage.module.css'

interface LocationState {
  ids?: number[]
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { movies } = useMovies()

  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const movieId = Number(id)
  // Falls back to the full cached list when the detail page is opened
  // directly (e.g. a page reload), so prev/next still has something to work with.
  const ids = (location.state as LocationState | null)?.ids ?? movies.map((m) => m.id)
  const currentIndex = ids.indexOf(movieId)
  const prevId = currentIndex > 0 ? ids[currentIndex - 1] : null
  const nextId = currentIndex >= 0 && currentIndex < ids.length - 1 ? ids[currentIndex + 1] : null

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchMovieDetails(movieId)
      .then((data) => {
        if (!cancelled) setDetails(data)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load movie details.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [movieId])

  function goTo(targetId: number | null) {
    if (targetId === null) return
    navigate(`/movie/${targetId}`, { state: { ids } })
  }

  if (loading) return <p className={styles.status}>Loading…</p>
  if (error || !details) return <p className={styles.statusError}>{error ?? 'Movie not found.'}</p>

  const poster = posterUrl(details.poster_path, 'w500')

  return (
    <div className={styles.page}>
      <Link to="/list" className={styles.back}>
        ← Back
      </Link>

      <div className={styles.content}>
        {poster ? (
          <img src={poster} alt={`${details.title} poster`} className={styles.poster} />
        ) : (
          <div className={styles.posterFallback}>No Image</div>
        )}

        <div className={styles.info}>
          <h1 className={styles.title}>{details.title}</h1>
          {details.tagline && <p className={styles.tagline}>{details.tagline}</p>}

          <ul className={styles.metaList}>
            <li>
              <strong>Release Date:</strong> {details.release_date || 'Unknown'}
            </li>
            <li>
              <strong>Rating:</strong> ⭐ {details.vote_average.toFixed(1)} ({details.vote_count} votes)
            </li>
            <li>
              <strong>Runtime:</strong> {details.runtime ? `${details.runtime} min` : 'Unknown'}
            </li>
            <li>
              <strong>Genres:</strong>{' '}
              {details.genres.length > 0 ? details.genres.map((g) => g.name).join(', ') : 'Unknown'}
            </li>
          </ul>

          <p className={styles.overview}>{details.overview || 'No overview available.'}</p>
        </div>
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          onClick={() => goTo(prevId)}
          disabled={prevId === null}
          className={styles.navButton}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(nextId)}
          disabled={nextId === null}
          className={styles.navButton}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
