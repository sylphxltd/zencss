import { Box, Flex, Text } from '../zen.config'

/**
 * Typography Demo
 * Showcases font sizes, weights, and text styling
 */
export function TypographyDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Typography System
      </Text>

      <Flex gap={6} flexDirection="column">
        {/* Font Sizes */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Font Size Scale
          </Text>
          <Box p={6} bg="white" rounded="lg" shadow="md">
            <Text fontSize="xs" mb={2}>
              Extra Small (xs) - 0.75rem
            </Text>
            <Text fontSize="sm" mb={2}>
              Small (sm) - 0.875rem
            </Text>
            <Text fontSize="base" mb={2}>
              Base (base) - 1rem
            </Text>
            <Text fontSize="lg" mb={2}>
              Large (lg) - 1.125rem
            </Text>
            <Text fontSize="xl" mb={2}>
              Extra Large (xl) - 1.25rem
            </Text>
            <Text fontSize="2xl" mb={2}>
              2X Large (2xl) - 1.5rem
            </Text>
            <Text fontSize="3xl" mb={2}>
              3X Large (3xl) - 1.875rem
            </Text>
            <Text fontSize="4xl">4X Large (4xl) - 2.25rem</Text>
          </Box>
        </Box>

        {/* Font Weights */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Font Weight Scale
          </Text>
          <Box p={6} bg="white" rounded="lg" shadow="md">
            <Text fontWeight="normal" fontSize="lg" mb={2}>
              Normal (400) - Regular text weight
            </Text>
            <Text fontWeight="medium" fontSize="lg" mb={2}>
              Medium (500) - Slightly emphasized
            </Text>
            <Text fontWeight="semibold" fontSize="lg" mb={2}>
              Semibold (600) - Section headers
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              Bold (700) - Strong emphasis
            </Text>
          </Box>
        </Box>

        {/* Color Variants */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Text Colors
          </Text>
          <Box p={6} bg="white" rounded="lg" shadow="md">
            <Text color="gray.900" fontSize="lg" mb={2}>
              Primary text (gray.900)
            </Text>
            <Text color="gray.700" fontSize="lg" mb={2}>
              Secondary text (gray.700)
            </Text>
            <Text color="gray.600" fontSize="lg" mb={2}>
              Tertiary text (gray.600)
            </Text>
            <Text color="gray.500" fontSize="lg" mb={2}>
              Muted text (gray.500)
            </Text>
            <Text color="brand.500" fontSize="lg" mb={2}>
              Brand colored text (brand.500)
            </Text>
            <Text color="red.500" fontSize="lg" mb={2}>
              Error text (red.500)
            </Text>
            <Text color="green.500" fontSize="lg">
              Success text (green.500)
            </Text>
          </Box>
        </Box>

        {/* Combined Styles */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Combined Typography Styles
          </Text>
          <Box p={6} bg="white" rounded="lg" shadow="md">
            <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={4}>
              Article Headline
            </Text>
            <Text fontSize="xl" fontWeight="semibold" color="gray.700" mb={4}>
              A compelling subheadline that draws readers in
            </Text>
            <Text fontSize="base" color="gray.600" lineHeight="relaxed" mb={3}>
              This is a paragraph of body text demonstrating how typography
              tokens work together. The font size is 'base', the color is
              'gray.600', and the line height is 'relaxed' for better
              readability.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Small print or footer text using 'sm' font size and 'gray.500'
              color.
            </Text>
          </Box>
        </Box>

        {/* Type Safety Note */}
        <Box p={6} bg="brand.50" rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            ✍️ Type-Safe Typography
          </Text>
          <Text fontSize="sm" color="gray.700">
            All typography props (fontSize, fontWeight, lineHeight, color) are
            fully type-checked against your design tokens. Try using an invalid
            token like fontSize="invalid" - TypeScript will catch it!
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
