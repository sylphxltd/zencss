/**
 * Type Check Demo
 * Hover over variables to see inferred types
 */

import { Box, Text, styled } from './silk.config'

// 測試 1: Box props 應該有完整的 color union type
function Test1() {
  return (
    <Box
      // Hover over bg - should show all color tokens
      bg="brand.500"
      // Hover over color - should show all color tokens
      color="gray.900"
      // Hover over p - should show all spacing tokens
      p={4}
      // Hover over fontSize - should show all font size tokens
      fontSize="lg"
    >
      Test
    </Box>
  )
}

// 測試 2: Text props 應該有完整的 typography union type
function Test2() {
  return (
    <Text
      color="brand.600"
      fontSize="2xl"
      fontWeight="semibold"
      lineHeight="tight"
    >
      Heading
    </Text>
  )
}

// 測試 3: styled 組件應該保留類型
const StyledBox = styled('div', {
  bg: 'brand.100',
  p: 6,
  rounded: 'lg',
})

function Test3() {
  return (
    <StyledBox
      // 這些 props 應該有完整的類型
      color="gray.800"
      fontSize="base"
    >
      Styled content
    </StyledBox>
  )
}

// 測試 4: 動態 props 覆蓋
const Button = styled('button', {
  px: 6,
  py: 3,
  bg: 'brand.500',
  color: 'white',
  rounded: 'md',
  fontWeight: 'semibold',
})

function Test4() {
  return (
    <>
      {/* 默認樣式 */}
      <Button>Primary Button</Button>

      {/* 覆蓋 bg - 應該有完整的 color tokens */}
      <Button bg="red.500">Danger Button</Button>

      {/* 覆蓋 rounded - 應該有完整的 radii tokens */}
      <Button rounded="full">Rounded Button</Button>
    </>
  )
}

// 測試 5: Pseudo selectors
function Test5() {
  return (
    <Box
      p={4}
      bg="brand.500"
      // Hover over _hover.bg - 應該有完整的 color tokens
      _hover={{
        bg: 'brand.600',
      }}
      _focus={{
        bg: 'brand.700',
      }}
    >
      Interactive box
    </Box>
  )
}

// 類型測試：這些應該產生 TypeScript 錯誤（如果取消註釋）
function TypeErrors() {
  return (
    <Box>
      {/* Invalid color token - would produce error if uncommented */}
      {/* <Text color="invalid.500">Should fail</Text> */}

      {/* Invalid fontSize token - would produce error if uncommented */}
      {/* <Text fontSize="huge">Should fail</Text> */}

      {/* Invalid spacing token - would produce error if uncommented */}
      {/* <Box p="999">Should fail</Box> */}

      {/* Invalid fontWeight token - would produce error if uncommented */}
      {/* <Text fontWeight="ultralight">Should fail</Text> */}
    </Box>
  )
}

export { Test1, Test2, Test3, Test4, Test5, TypeErrors }
