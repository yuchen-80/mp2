import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>MP2 Movies</span>
    </nav>
  )
}
