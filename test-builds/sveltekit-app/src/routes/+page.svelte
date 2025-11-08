<script lang="ts">
  import { createStyleSystem } from '@sylphx/silk'

  const { css } = createStyleSystem({})

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
      color: '#ff3e00',
      marginBottom: '1.5rem'
    } as any),
    subtitle: css({
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem'
    } as any),
    features: css({
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    } as any),
    feature: css({
      padding: '1rem 2rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    } as any)
  }
</script>

<div class={styles.container.className}>
  <h1 class={styles.title.className}>SvelteKit + Silk ✅</h1>
  <p class={styles.subtitle.className}>Full-stack testing</p>
  <div class={styles.features.className}>
    <div class={styles.feature.className}>SSR</div>
    <div class={styles.feature.className}>SSG</div>
    <div class={styles.feature.className}>SPA</div>
  </div>
</div>
