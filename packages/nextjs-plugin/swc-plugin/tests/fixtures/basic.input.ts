import { css } from '@sylphx/silk'

// Basic single property
const red = css({ bg: 'red' })

// Multiple properties
const button = css({
  bg: 'blue',
  color: 'white',
  p: 4,
  rounded: 8,
})

// Numbers with different units
const box = css({
  p: 4,        // Should be 1rem (4 * 0.25)
  m: 2,        // Should be 0.5rem (2 * 0.25)
  width: 200,  // Should be 200px
  opacity: 0.5, // Should be 0.5 (unitless)
  zIndex: 10,   // Should be 10 (unitless)
})

// CamelCase properties
const text = css({
  fontSize: 16,
  fontWeight: 'bold',
  backgroundColor: 'yellow',
})

// String values
const colors = css({
  color: 'rgb(255, 0, 0)',
  bg: '#ff0000',
  borderColor: 'rgba(0, 0, 0, 0.5)',
})
