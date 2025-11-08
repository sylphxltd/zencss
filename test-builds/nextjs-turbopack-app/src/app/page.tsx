import { createStyleSystem } from '@sylphx/silk';

const { css } = createStyleSystem({});

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0'
  } as any),
  title: css({
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '1.5rem'
  } as any),
  button: css({
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '1rem 2.5rem',
    borderRadius: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none'
  } as any)
};

export default function HomePage() {
  return (
    <div className={styles.container.className}>
      <h1 className={styles.title.className}>
        Next.js + Silk (Turbopack + CLI) ✅
      </h1>
      <button className={styles.button.className}>
        Click me
      </button>
    </div>
  );
}
