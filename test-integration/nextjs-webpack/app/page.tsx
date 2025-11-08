import { css } from '@sylphx/silk'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Webpack Build Test</h1>
      <p className={styles.subtitle}>Testing lightningcss-wasm with Next.js Webpack</p>
      <div className={styles.status}>✅ If styled, it works!</div>
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
    backgroundColor: '#f5f5f5',
  }),
  title: css({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
  }),
  subtitle: css({
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
  }),
  status: css({
    padding: '1rem 2rem',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
  }),
}
