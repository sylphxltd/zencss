import { css } from '@sylphx/silk'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Turbopack Build Test</h1>
      <p className={styles.subtitle}>Testing lightningcss-wasm with Next.js Turbopack</p>
      <div className={styles.status}>✅ If styled, Turbopack works!</div>
    </div>
  )
}

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#0a0a0a',
  }),
  title: css({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
  }),
  subtitle: css({
    fontSize: '1.25rem',
    color: '#aaa',
    marginBottom: '2rem',
  }),
  status: css({
    padding: '1rem 2rem',
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
  }),
}
