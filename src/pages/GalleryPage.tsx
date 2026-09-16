import { useMemo, useState } from 'react'
import PosterTile from '../components/PosterTile'
import { useMovies } from '../context/MoviesContext'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const { movies, genres, loading, error } = useMovies()
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set())

  function toggleGenre(id: number) {
    setSelectedGenres((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    if (selectedGenres.size === 0) return movies
    return movies.filter((m) => m.genre_ids.some((g) => selectedGenres.has(g)))
  }, [movies, selectedGenres])

  const ids = useMemo(() => filtered.map((m) => m.id), [filtered])

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Movie Gallery</h1>

      <fieldset className={styles.genreFilter}>
        <legend>Filter by genre</legend>
        {genres.map((genre) => (
          <label key={genre.id} className={styles.genreOption}>
            <input
              type="checkbox"
              checked={selectedGenres.has(genre.id)}
              onChange={() => toggleGenre(genre.id)}
            />
            {genre.name}
          </label>
        ))}
      </fieldset>

      {loading && <p className={styles.status}>Loading movies…</p>}
      {error && <p className={styles.statusError}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className={styles.status}>No movies match the selected genres.</p>
      )}

      <div className={styles.grid}>
        {filtered.map((movie) => (
          <PosterTile key={movie.id} movie={movie} ids={ids} />
        ))}
      </div>
    </div>
  )
}
