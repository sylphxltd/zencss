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
    button: css({
      backgroundColor: '#ff3e00',
      color: 'white',
      padding: '1rem 2.5rem',
      borderRadius: '0.75rem',
      fontSize: '1.25rem',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none'
    } as any)
  }
</script>

<div class={styles.container.className}>
  <h1 class={styles.title.className}>Svelte + Silk ✅</h1>
  <button class={styles.button.className}>Test Button</button>
</div>
