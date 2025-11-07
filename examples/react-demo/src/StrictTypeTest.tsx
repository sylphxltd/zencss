/**
 * Test file demonstrating strict type safety
 * This file shows how invalid design tokens now produce TypeScript errors
 */

import { Box, Text, styled } from './zen.config'

export function StrictTypeTest() {
  return (
    <Box p={6} bg="brand.50" rounded="lg">
      <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={4}>
        Strict Type Safety Test
      </Text>

      {/* ✅ VALID: Using design tokens from config */}
      <Box
        bg="brand.500" // Valid: brand.500 exists in config
        color="white" // Valid: white exists in config
        p={4} // Valid: 4 exists in spacing config
        rounded="md" // Valid: md exists in radii config
        mb={4}
      >
        <Text>This is valid - all tokens exist in config</Text>
      </Box>

      {/* ✅ VALID: Using numbers for spacing/sizing */}
      <Box
        p={16} // Valid: numbers are allowed for spacing
        m={8} // Valid: numbers are allowed
        opacity={0.8} // Valid: numbers are allowed for opacity
      >
        <Text>Using numeric values directly</Text>
      </Box>

      {/* ❌ INVALID: These would produce TypeScript errors */}
      {/* Uncomment to see type errors: */}

      {/*
      <Box
        bg="purple.500" // ERROR: purple color doesn't exist in config
        color="pink.300" // ERROR: pink color doesn't exist
      >
        Invalid colors
      </Box>
      */}

      {/*
      <Box
        p="custom" // ERROR: "custom" is not in spacing tokens
        rounded="super-round" // ERROR: not in radii tokens
      >
        Invalid token strings
      </Box>
      */}

      {/*
      <Box
        shadow="my-custom-shadow" // ERROR: not in shadows config
        opacity="0.5" // ERROR: opacity must be number, not string
      >
        Invalid effect values
      </Box>
      */}

      {/* ✅ VALID: Using style prop as escape hatch */}
      <Box
        bg="brand.500"
        p={4}
        style={{
          // Use style prop for custom values outside design system
          background: 'linear-gradient(to right, #ff0000, #00ff00)',
          boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
          borderRadius: '30px',
        }}
      >
        <Text color="white">
          Custom styles via style prop (escape hatch for values outside design
          system)
        </Text>
      </Box>

      {/* ✅ VALID: Pseudo selectors with strict typing */}
      <Box
        p={4}
        bg="gray.100"
        _hover={{
          bg: 'gray.200', // Valid: gray.200 exists
        }}
        _focus={{
          bg: 'gray.300', // Valid: gray.300 exists
        }}
      >
        <Text>Hover to see pseudo selector (type-safe)</Text>
      </Box>

      {/* ✅ VALID: styled components with strict typing */}
      <StrictButton>Styled Button</StrictButton>

      <Box mt={6} p={4} bg="green.50" rounded="md">
        <Text fontSize="sm" color="green.900">
          <strong>Summary:</strong> With strict type safety enabled:
          <br />
          ✅ Only design tokens from your config are allowed
          <br />
          ✅ Numbers are allowed for spacing, sizing, and opacity
          <br />
          ✅ Invalid tokens produce TypeScript errors at compile time
          <br />
          ✅ Use the <code>style</code> prop for custom values outside the
          design system
        </Text>
      </Box>
    </Box>
  )
}

// ✅ VALID: styled component with design tokens
const StrictButton = styled('button', {
  px: 6,
  py: 3,
  bg: 'brand.500', // Valid: design token
  color: 'white', // Valid: design token
  rounded: 'md', // Valid: design token
  fontWeight: 'semibold',
  _hover: {
    bg: 'brand.600', // Valid: design token
  },
})

// ❌ INVALID: Uncomment to see type errors
/*
const InvalidButton = styled('button', {
  bg: 'purple.500',        // ERROR: purple doesn't exist
  color: 'custom-color',   // ERROR: custom-color doesn't exist
  rounded: 'super-round',  // ERROR: super-round doesn't exist
})
*/
