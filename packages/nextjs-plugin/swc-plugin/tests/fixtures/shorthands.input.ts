import { css } from '@sylphx/silk'

// Margin shorthands
const margins = css({
  m: 4,   // margin
  mt: 2,  // margin-top
  mr: 3,  // margin-right
  mb: 4,  // margin-bottom
  ml: 1,  // margin-left
  mx: 2,  // margin-inline
  my: 3,  // margin-block
})

// Padding shorthands
const paddings = css({
  p: 4,   // padding
  pt: 2,  // padding-top
  pr: 3,  // padding-right
  pb: 4,  // padding-bottom
  pl: 1,  // padding-left
  px: 2,  // padding-inline
  py: 3,  // padding-block
})

// Size shorthands
const sizes = css({
  w: 200,       // width
  h: 100,       // height
  minW: 50,     // min-width
  minH: 30,     // min-height
  maxW: 400,    // max-width
  maxH: 300,    // max-height
})

// Background shorthands
const backgrounds = css({
  bg: 'red',          // background-color
  bgColor: 'blue',    // background-color
})

// Border radius shorthand
const rounded = css({
  rounded: 8,  // border-radius
})
