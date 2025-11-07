import { Box, Flex, Text, styled } from '../silk.config'

/**
 * Variants & Recipes Demo
 * Showcases component variants and recipe patterns
 */

// Button with variants (manual approach)
const VariantButton = styled('button', {
  px: 6,
  py: 3,
  rounded: 'md',
  fontWeight: 'semibold',
  fontSize: 'base',
})

export function VariantsDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Variants & Recipes
      </Text>

      <Flex gap={6} flexDirection="column">
        {/* Color Variants */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Color Variants
          </Text>
          <Flex gap={3} flexDirection="row">
            <VariantButton bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
              Primary
            </VariantButton>
            <VariantButton bg="gray.200" color="gray.800" _hover={{ bg: 'gray.300' }}>
              Secondary
            </VariantButton>
            <VariantButton bg="red.500" color="white" _hover={{ bg: 'red.600' }}>
              Danger
            </VariantButton>
            <VariantButton bg="green.500" color="white" _hover={{ bg: 'green.600' }}>
              Success
            </VariantButton>
          </Flex>
        </Box>

        {/* Size Variants */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Size Variants
          </Text>
          <Flex gap={3} alignItems="center">
            <VariantButton
              px={3}
              py={1}
              fontSize="sm"
              bg="brand.500"
              color="white"
            >
              Small
            </VariantButton>
            <VariantButton
              px={4}
              py={2}
              fontSize="base"
              bg="brand.500"
              color="white"
            >
              Medium
            </VariantButton>
            <VariantButton
              px={6}
              py={3}
              fontSize="lg"
              bg="brand.500"
              color="white"
            >
              Large
            </VariantButton>
          </Flex>
        </Box>

        {/* Badge Variants */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Badge Variants
          </Text>
          <Flex gap={3} alignItems="center">
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="sm"
              fontWeight="medium"
              bg="brand.100"
              color="brand.700"
            >
              Info
            </Box>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="sm"
              fontWeight="medium"
              bg="green.100"
              color="green.700"
            >
              Success
            </Box>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="sm"
              fontWeight="medium"
              bg="red.100"
              color="red.700"
            >
              Error
            </Box>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="sm"
              fontWeight="medium"
              bg="gray.100"
              color="gray.700"
            >
              Neutral
            </Box>
          </Flex>
        </Box>

        {/* Card Variants */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Card Variants
          </Text>
          <Flex gap={4}>
            <Box p={6} bg="white" rounded="lg" shadow="sm" w="full">
              <Text fontWeight="semibold" mb={2}>
                Subtle Card
              </Text>
              <Text fontSize="sm" color="gray.600">
                Light shadow, minimal elevation
              </Text>
            </Box>
            <Box p={6} bg="white" rounded="lg" shadow="md" w="full">
              <Text fontWeight="semibold" mb={2}>
                Medium Card
              </Text>
              <Text fontSize="sm" color="gray.600">
                Medium shadow, moderate elevation
              </Text>
            </Box>
            <Box p={6} bg="white" rounded="lg" shadow="lg" w="full">
              <Text fontWeight="semibold" mb={2}>
                Elevated Card
              </Text>
              <Text fontSize="sm" color="gray.600">
                Heavy shadow, high elevation
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Type Safety Note */}
        <Box p={6} bg="brand.50" rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            🎯 Fully Type-Safe Variants
          </Text>
          <Text fontSize="sm" color="gray.700">
            All variant props (bg, color, px, py, fontSize, etc.) are fully
            type-checked against your design tokens. Invalid values will cause
            TypeScript errors at compile time.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
