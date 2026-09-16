import { NavLink } from 'react-router-dom'
import styles from './ViewToggle.module.css'

export default function ViewToggle() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.option} ${styles.active}` : styles.option

  return (
    <div className={styles.toggle}>
      <NavLink to="/" className={linkClass} end>
        List
      </NavLink>
      <NavLink to="/gallery" className={linkClass}>
        Gallery
      </NavLink>
    </div>
  )
}
