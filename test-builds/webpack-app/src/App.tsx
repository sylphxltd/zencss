import React from 'react';
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
  }),
  title: css({
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '1.5rem'
  }),
  button: css({
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1rem 2.5rem',
    borderRadius: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 600
  })
};

export function App() {
  return (
    <div className={styles.container.className}>
      <h1 className={styles.title.className}>
        Webpack + Silk Test ✅
      </h1>
      <button className={styles.button.className}>
        Click me
      </button>
    </div>
  );
}
