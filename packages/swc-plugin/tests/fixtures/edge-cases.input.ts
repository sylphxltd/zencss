import { css } from '@sylphx/silk'

// Empty object - should result in empty string
const empty = css({})

// Single property
const single = css({ color: 'red' })

// Special characters in values
const special = css({
  color: 'rgb(255, 0, 0)',
  bg: '#ff0000',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
})

// Zero values
const zeros = css({
  p: 0,
  m: 0,
  opacity: 0,
})

// Unitless properties that should stay unitless
const unitless = css({
  opacity: 0.5,
  zIndex: 10,
  fontWeight: 600,
  lineHeight: 1.5,
  flex: 1,
})

// Numbers that should get px
const withPx = css({
  width: 200,
  height: 100,
  top: 50,
  left: 25,
})

// Properties with hyphens (when camelCased)
const hyphenated = css({
  backgroundColor: 'blue',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  borderRadius: 8,
})

// Multiple css() calls in same file
const style1 = css({ bg: 'red' })
const style2 = css({ bg: 'blue' })
const style3 = css({ bg: 'green' })

// Nested in expression
const conditional = true ? css({ bg: 'red' }) : css({ bg: 'blue' })

// As function argument
function Component({ className }: { className: string }) {
  return className
}

const comp = Component({ className: css({ p: 4 }) })
