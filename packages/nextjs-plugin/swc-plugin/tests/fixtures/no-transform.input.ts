// These should NOT be transformed

// Regular function calls named css but not from @sylphx/silk
function css(obj: any) {
  return obj
}

const notTransformed1 = css({ bg: 'red' })

// Other function calls
const fetch1 = fetch('https://api.com')
const map1 = [1, 2, 3].map(x => x * 2)

// Object literals not in css()
const obj = {
  bg: 'red',
  p: 4,
  color: 'blue',
}

// JSX props
const element = <div style={{ bg: 'red', p: 4 }} />

// Array with objects
const arr = [
  { bg: 'red' },
  { p: 4 },
]

// Regular variables
const bg = 'red'
const p = 4

// Function call with similar structure but not css()
const style = makeStyle({ bg: 'red', p: 4 })

// css in string
const str = "css({ bg: 'red' })"

// css in comment should not be touched
// css({ bg: 'red' })
