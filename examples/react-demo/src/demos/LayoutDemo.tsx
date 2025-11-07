import { Box, Flex, Text } from '../zen.config'

/**
 * Layout Demo
 * Showcases Flexbox, Grid, and spacing utilities
 */
export function LayoutDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Layout System
      </Text>

      <Flex gap={6} flexDirection="column">
        {/* Flexbox Layout */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Flexbox Layout
          </Text>

          {/* Horizontal Flex */}
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Horizontal with gap
            </Text>
            <Flex gap={4}>
              <Box p={4} bg="brand.100" rounded="md" w="full">
                <Text>Item 1</Text>
              </Box>
              <Box p={4} bg="brand.200" rounded="md" w="full">
                <Text>Item 2</Text>
              </Box>
              <Box p={4} bg="brand.300" rounded="md" w="full">
                <Text>Item 3</Text>
              </Box>
            </Flex>
          </Box>

          {/* Vertical Flex */}
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Vertical with justifyContent
            </Text>
            <Flex flexDirection="column" gap={3}>
              <Box p={4} bg="brand.400" rounded="md">
                <Text color="white">Stack Item 1</Text>
              </Box>
              <Box p={4} bg="brand.500" rounded="md">
                <Text color="white">Stack Item 2</Text>
              </Box>
              <Box p={4} bg="brand.600" rounded="md">
                <Text color="white">Stack Item 3</Text>
              </Box>
            </Flex>
          </Box>

          {/* Centered Content */}
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Centered content
            </Text>
            <Flex
              justifyContent="center"
              alignItems="center"
              h="20"
              bg="gray.100"
              rounded="md"
            >
              <Text fontWeight="semibold">Perfectly Centered</Text>
            </Flex>
          </Box>

          {/* Space Between */}
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Space between items
            </Text>
            <Flex justifyContent="space-between" alignItems="center" p={4} bg="gray.100" rounded="md">
              <Text fontWeight="semibold">Left</Text>
              <Text fontWeight="semibold">Center</Text>
              <Text fontWeight="semibold">Right</Text>
            </Flex>
          </Box>
        </Box>

        {/* Spacing System */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            Spacing System
          </Text>

          <Box p={6} bg="white" rounded="lg" shadow="md">
            <Box mb={4}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Padding scale (all type-safe)
              </Text>
              <Flex gap={2}>
                <Box p={1} bg="brand.100" rounded="md">
                  <Text fontSize="xs">p:1</Text>
                </Box>
                <Box p={2} bg="brand.100" rounded="md">
                  <Text fontSize="xs">p:2</Text>
                </Box>
                <Box p={3} bg="brand.100" rounded="md">
                  <Text fontSize="xs">p:3</Text>
                </Box>
                <Box p={4} bg="brand.100" rounded="md">
                  <Text fontSize="xs">p:4</Text>
                </Box>
                <Box p={6} bg="brand.100" rounded="md">
                  <Text fontSize="xs">p:6</Text>
                </Box>
              </Flex>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Directional spacing
              </Text>
              <Box pt={2} pr={4} pb={6} pl={8} bg="brand.50" rounded="md">
                <Text fontSize="sm">
                  pt:2, pr:4, pb:6, pl:8 - All type-checked!
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Type Safety Note */}
        <Box p={6} bg="brand.50" rounded="lg">
          <Text fontWeight="semibold" mb={2}>
            📐 Type-Safe Layout Props
          </Text>
          <Text fontSize="sm" color="gray.700">
            All layout props (display, flexDirection, justifyContent, alignItems, gap, etc.)
            and spacing values are fully type-checked. Invalid values will cause TypeScript errors.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
