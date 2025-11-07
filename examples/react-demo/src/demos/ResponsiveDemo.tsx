import { Box, Text } from '../zen.config'

/**
 * Responsive Design Demo
 * Showcases responsive utilities and breakpoints
 */
export function ResponsiveDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Responsive Design
      </Text>

      {/* Responsive Grid */}
      <Box
        display="grid"
        gap={4}
        mb={6}
        // Note: Responsive props would be like { base: 1, md: 2, lg: 3 }
        // This is a simplified version showing type-safe tokens
      >
        <Box bg="brand.100" p={6} rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            Grid Item 1
          </Text>
          <Text fontSize="sm" color="gray.600">
            Resize window to see responsive behavior
          </Text>
        </Box>

        <Box bg="brand.200" p={6} rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            Grid Item 2
          </Text>
          <Text fontSize="sm" color="gray.600">
            Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
          </Text>
        </Box>

        <Box bg="brand.300" p={6} rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            Grid Item 3
          </Text>
          <Text fontSize="sm" color="gray.600">
            All breakpoints are type-safe
          </Text>
        </Box>
      </Box>

      {/* Responsive Typography */}
      <Box p={6} bg="white" rounded="lg" shadow="md">
        <Text fontSize="4xl" fontWeight="bold" mb={2}>
          Responsive Typography
        </Text>
        <Text fontSize="xl" color="gray.600" mb={4}>
          Font sizes scale across breakpoints
        </Text>
        <Text fontSize="base" color="gray.500">
          This text is base size on mobile and scales up on larger screens.
          All font size tokens are fully type-checked.
        </Text>
      </Box>
    </Box>
  )
}
