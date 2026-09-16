import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>MP2 Movies</span>
      <div className={styles.links}>
        <NavLink to="/" className={linkClass} end>
          List
        </NavLink>
        <NavLink to="/gallery" className={linkClass}>
          Gallery
        </NavLink>
      </div>
    </nav>
  )
}
