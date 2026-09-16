import { Link } from 'react-router-dom'
import { posterUrl } from '../api/tmdb'
import type { Movie } from '../types'
import styles from './MovieRow.module.css'

interface Props {
  movie: Movie
  ids: number[]
}

export default function MovieRow({ movie, ids }: Props) {
  const poster = posterUrl(movie.poster_path)
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'

  return (
    <Link to={`/movie/${movie.id}`} state={{ ids }} className={styles.row}>
      {poster ? (
        <img src={poster} alt={`${movie.title} poster`} className={styles.thumb} />
      ) : (
        <div className={styles.thumbFallback}>No Image</div>
      )}
      <div className={styles.info}>
        <span className={styles.title}>{movie.title}</span>
        <span className={styles.meta}>
          {year} · ⭐ {movie.vote_average.toFixed(1)}
        </span>
      </div>
    </Link>
  )
}
