import { useState } from 'react'
import { Box, Flex, Text, styled } from '../silk.config'

/**
 * Component Composition Demo
 * Showcases building complex UIs by composing primitives
 */

const Card = styled('div', {
  p: 6,
  bg: 'white',
  rounded: 'lg',
  shadow: 'md',
})

const Button = styled('button', {
  px: 6,
  py: 3,
  rounded: 'md',
  fontWeight: 'semibold',
  fontSize: 'base',
  bg: 'brand.500',
  color: 'white',
  _hover: {
    bg: 'brand.600',
  },
})

const Input = styled('input', {
  w: 'full',
  p: 3,
  rounded: 'md',
  borderWidth: '2px',
  borderColor: 'gray.300',
  _focus: {
    borderColor: 'brand.500',
  },
})

export function CompositionDemo() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Component Composition
      </Text>

      <Flex gap={6} flexDirection="column">
        {/* Profile Card Example */}
        <Card>
          <Flex gap={4} alignItems="center" mb={4}>
            <Box
              w={16}
              h={16}
              rounded="full"
              bg="brand.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="2xl" fontWeight="bold" color="brand.700">
                JD
              </Text>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                John Doe
              </Text>
              <Text fontSize="sm" color="gray.600">
                Product Designer
              </Text>
            </Box>
          </Flex>

          <Box mb={4}>
            <Text fontSize="sm" color="gray.700" mb={2}>
              Passionate about creating delightful user experiences with
              attention to detail and performance.
            </Text>
          </Box>

          <Flex gap={3}>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="xs"
              fontWeight="medium"
              bg="brand.100"
              color="brand.700"
            >
              Design Systems
            </Box>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="xs"
              fontWeight="medium"
              bg="brand.100"
              color="brand.700"
            >
              TypeScript
            </Box>
            <Box
              as="span"
              px={3}
              py={1}
              rounded="full"
              fontSize="xs"
              fontWeight="medium"
              bg="brand.100"
              color="brand.700"
            >
              React
            </Box>
          </Flex>
        </Card>

        {/* Newsletter Form Example */}
        <Card>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Subscribe to Newsletter
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Get the latest updates delivered to your inbox weekly
          </Text>

          <form onSubmit={handleSubmit}>
            <Flex gap={3} flexDirection="column">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">Subscribe</Button>
            </Flex>
          </form>

          {submitted && (
            <Box mt={4} p={3} bg="green.100" rounded="md">
              <Text fontSize="sm" color="green.700" fontWeight="medium">
                ✓ Successfully subscribed!
              </Text>
            </Box>
          )}
        </Card>

        {/* Stats Dashboard Example */}
        <Card>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Dashboard Stats
          </Text>

          <Flex gap={4}>
            <Box p={4} bg="brand.50" rounded="lg" w="full">
              <Text fontSize="3xl" fontWeight="bold" color="brand.600" mb={1}>
                2.4K
              </Text>
              <Text fontSize="sm" color="gray.600">
                Total Users
              </Text>
              <Text fontSize="xs" color="green.600" fontWeight="medium" mt={2}>
                ↑ 12% from last month
              </Text>
            </Box>

            <Box p={4} bg="gray.50" rounded="lg" w="full">
              <Text fontSize="3xl" fontWeight="bold" color="gray.700" mb={1}>
                $48K
              </Text>
              <Text fontSize="sm" color="gray.600">
                Revenue
              </Text>
              <Text fontSize="xs" color="green.600" fontWeight="medium" mt={2}>
                ↑ 8% from last month
              </Text>
            </Box>

            <Box p={4} bg="red.50" rounded="lg" w="full">
              <Text fontSize="3xl" fontWeight="bold" color="red.600" mb={1}>
                3.2%
              </Text>
              <Text fontSize="sm" color="gray.600">
                Bounce Rate
              </Text>
              <Text fontSize="xs" color="red.600" fontWeight="medium" mt={2}>
                ↓ 2% from last month
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* Feature Highlights */}
        <Box p={6} bg="brand.50" rounded="lg">
          <Text fontWeight="semibold" mb={3}>
            🎨 Composition Benefits
          </Text>
          <Flex gap={3} flexDirection="column">
            <Text fontSize="sm" color="gray.700">
              • <strong>Reusable Components</strong>: Build once, use
              everywhere with consistent styling
            </Text>
            <Text fontSize="sm" color="gray.700">
              • <strong>Type Safety</strong>: All props are type-checked at
              compile time
            </Text>
            <Text fontSize="sm" color="gray.700">
              • <strong>Composability</strong>: Combine primitives to create
              complex UIs
            </Text>
            <Text fontSize="sm" color="gray.700">
              • <strong>Override Props</strong>: Customize any component on the
              fly
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
