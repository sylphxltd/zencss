import { useState } from 'react'
import { Box, Flex, Text, styled } from './silk.config'
import { ResponsiveDemo } from './demos/ResponsiveDemo'
import { PseudoSelectorsDemo } from './demos/PseudoSelectorsDemo'
import { VariantsDemo } from './demos/VariantsDemo'
import { LayoutDemo } from './demos/LayoutDemo'
import { TypographyDemo } from './demos/TypographyDemo'
import { CompositionDemo } from './demos/CompositionDemo'
import { StrictTypeTest } from './StrictTypeTest'

const Container = styled('div', {
  w: 'full',
  minHeight: 'screen',
  bg: 'gray.50',
})

const Header = styled('header', {
  bg: 'white',
  shadow: 'md',
  p: 6,
  mb: 8,
})

const NavButton = styled('button', {
  px: 4,
  py: 2,
  rounded: 'md',
  fontSize: 'sm',
  fontWeight: 'medium',
  transition: 'all 0.2s',
})

const DemoContainer = styled('div', {
  w: 'full',
  p: 8,
})

type DemoKey =
  | 'overview'
  | 'layout'
  | 'typography'
  | 'pseudo'
  | 'variants'
  | 'responsive'
  | 'composition'
  | 'strictTypes'

const demos: Record<DemoKey, { title: string; component: React.ReactNode }> = {
  overview: {
    title: 'Overview',
    component: <OverviewDemo />,
  },
  layout: {
    title: 'Layout',
    component: <LayoutDemo />,
  },
  typography: {
    title: 'Typography',
    component: <TypographyDemo />,
  },
  pseudo: {
    title: 'Pseudo Selectors',
    component: <PseudoSelectorsDemo />,
  },
  variants: {
    title: 'Variants',
    component: <VariantsDemo />,
  },
  responsive: {
    title: 'Responsive',
    component: <ResponsiveDemo />,
  },
  composition: {
    title: 'Composition',
    component: <CompositionDemo />,
  },
  strictTypes: {
    title: 'Strict Type Safety',
    component: <StrictTypeTest />,
  },
}

function OverviewDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Welcome to ZenCSS
      </Text>

      <Flex gap={6} flexDirection="column">
        <Box p={6} bg="white" rounded="lg" shadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            🎨 Type-safe CSS-in-TypeScript without codegen
          </Text>
          <Text color="gray.600" mb={4}>
            ZenCSS delivers industry-leading bundle sizes while maintaining full
            type safety and zero runtime overhead. Unlike Panda CSS which
            requires codegen, ZenCSS achieves complete type inference through
            pure TypeScript template literal types.
          </Text>

          <Flex gap={3} flexDirection="column">
            <Text fontSize="sm" color="gray.700">
              ✅ <strong>38-2100% smaller bundles</strong> than Tailwind and
              Panda CSS
            </Text>
            <Text fontSize="sm" color="gray.700">
              ✅ <strong>Zero codegen</strong> - instant autocomplete without
              build step
            </Text>
            <Text fontSize="sm" color="gray.700">
              ✅ <strong>Zero runtime</strong> - CSS extracted at build time
            </Text>
            <Text fontSize="sm" color="gray.700">
              ✅ <strong>Full type safety</strong> - catch errors at compile
              time
            </Text>
            <Text fontSize="sm" color="gray.700">
              ✅ <strong>Critical CSS extraction</strong> - unique to ZenCSS
            </Text>
          </Flex>
        </Box>

        <Box p={6} bg="brand.50" rounded="lg">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            📚 Explore the Demos
          </Text>
          <Text fontSize="sm" color="gray.700" mb={4}>
            Use the navigation above to explore different features:
          </Text>

          <Flex gap={3} flexDirection="column">
            <Text fontSize="sm" color="gray.700">
              <strong>Layout</strong> - Flexbox, Grid, spacing system
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Typography</strong> - Font sizes, weights, colors
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Pseudo Selectors</strong> - Hover, focus, active, disabled
              states
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Variants</strong> - Component variants and recipes
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Strict Type Safety</strong> - Only design tokens allowed,
              compile-time errors
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Responsive</strong> - Responsive design utilities
            </Text>
            <Text fontSize="sm" color="gray.700">
              <strong>Composition</strong> - Building complex UIs with
              primitives
            </Text>
          </Flex>
        </Box>

        <Box p={6} bg="white" rounded="lg" shadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            🔍 Type Inference in Action
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Try typing in your IDE - notice the autocomplete:
          </Text>

          <Box
            as="pre"
            p={4}
            bg="gray.900"
            color="white"
            rounded="md"
            fontSize="sm"
            style={{ overflow: 'auto' }}
          >
            {`// ✅ Valid - TypeScript knows these tokens exist
<Box color="brand.500" fontSize="lg" p={4} />

// ❌ Invalid - TypeScript error at compile time
<Box color="invalid.500" fontSize="huge" p="100" />

// ✨ Full autocomplete for all design tokens
<Text
  color="[Ctrl+Space for autocomplete]"
  fontSize="[Ctrl+Space for autocomplete]"
  fontWeight="[Ctrl+Space for autocomplete]"
/>`}
          </Box>
        </Box>

        <Box p={6} bg="green.50" rounded="lg">
          <Text fontSize="lg" fontWeight="bold" color="green.800" mb={2}>
            ✨ All demos showcase type safety
          </Text>
          <Text fontSize="sm" color="green.700">
            Every prop in every demo is fully type-checked. Try modifying values
            to invalid tokens and see TypeScript catch the errors at compile
            time!
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

function App() {
  const [activeDemo, setActiveDemo] = useState<DemoKey>('overview')

  return (
    <Container>
      <Header>
        <Box mb={4}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            ZenCSS Demo
          </Text>
          <Text fontSize="base" color="gray.600">
            Type-safe CSS-in-TypeScript • Zero codegen • Zero runtime • 38-2100%
            smaller bundles
          </Text>
        </Box>

        <Flex gap={2} style={{ flexWrap: 'wrap' }}>
          {(Object.keys(demos) as DemoKey[]).map((key) => (
            <NavButton
              key={key}
              onClick={() => setActiveDemo(key)}
              bg={activeDemo === key ? 'brand.500' : 'gray.200'}
              color={activeDemo === key ? 'white' : 'gray.700'}
              _hover={{
                bg: activeDemo === key ? 'brand.600' : 'gray.300',
              }}
            >
              {demos[key].title}
            </NavButton>
          ))}
        </Flex>
      </Header>

      <DemoContainer>{demos[activeDemo].component}</DemoContainer>
    </Container>
  )
}

export default App
