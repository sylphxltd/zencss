import { css } from '@sylphx/silk';

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }),
  title: css({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem'
  }),
  description: css({
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: '600px'
  })
};

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Silk + Next.js (Root App Directory)</h1>
      <p className={styles.description}>
        Testing srcDir: './app' configuration with webpack mode
      </p>
    </div>
  );
}
