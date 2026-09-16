import { useMemo, useState } from 'react'
import MovieRow from '../components/MovieRow'
import { useMovies } from '../context/MoviesContext'
import type { SortDirection, SortKey } from '../types'
import styles from './ListPage.module.css'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'release_date', label: 'Release Date' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'popularity', label: 'Popularity' },
]

export default function ListPage() {
  const { movies, loading, error } = useMovies()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('popularity')
  const [direction, setDirection] = useState<SortDirection>('desc')

  const filteredSorted = useMemo(() => {
    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(query.trim().toLowerCase()),
    )

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else {
        cmp = a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
      }
      return direction === 'asc' ? cmp : -cmp
    })

    return sorted
  }, [movies, query, sortKey, direction])

  const ids = useMemo(() => filteredSorted.map((m) => m.id), [filteredSorted])

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Popular Movies</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search}
        />

        <label className={styles.sortLabel}>
          Sort by
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={styles.select}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={styles.direction}
          onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {direction === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
        </button>
      </div>

      {loading && <p className={styles.status}>Loading movies…</p>}
      {error && <p className={styles.statusError}>{error}</p>}

      {!loading && !error && filteredSorted.length === 0 && (
        <p className={styles.status}>No movies match "{query}".</p>
      )}

      <ul className={styles.list}>
        {filteredSorted.map((movie) => (
          <li key={movie.id}>
            <MovieRow movie={movie} ids={ids} />
          </li>
        ))}
      </ul>
    </div>
  )
}
