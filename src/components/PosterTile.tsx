import { Link } from 'react-router-dom'
import { posterUrl } from '../api/tmdb'
import type { Movie } from '../types'
import styles from './PosterTile.module.css'

interface Props {
  movie: Movie
  ids: number[]
}

export default function PosterTile({ movie, ids }: Props) {
  const poster = posterUrl(movie.poster_path, 'w500')

  return (
    <Link to={`/movie/${movie.id}`} state={{ ids }} className={styles.tile}>
      {poster ? (
        <img src={poster} alt={`${movie.title} poster`} className={styles.poster} />
      ) : (
        <div className={styles.posterFallback}>{movie.title}</div>
      )}
      <span className={styles.caption}>{movie.title}</span>
    </Link>
  )
}
