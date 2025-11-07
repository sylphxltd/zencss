import { Box, Flex, Text, styled } from '../silk.config'

/**
 * Pseudo Selectors Demo
 * Showcases all pseudo-state styling capabilities
 */

const HoverBox = styled('div', {
  p: 6,
  bg: 'brand.100',
  rounded: 'lg',
  transition: 'all 0.2s',
  cursor: 'pointer',
  _hover: {
    bg: 'brand.200',
    // transform: 'scale(1.05)',
  },
})

const FocusInput = styled('input', {
  w: 'full',
  p: 3,
  rounded: 'md',
  borderWidth: '2px',
  borderColor: 'gray.300',
  _focus: {
    borderColor: 'brand.500',
    // outline: 'none',
  },
  _hover: {
    borderColor: 'gray.400',
  },
})

const ActiveButton = styled('button', {
  px: 6,
  py: 3,
  bg: 'brand.500',
  color: 'white',
  rounded: 'md',
  fontWeight: 'semibold',
  transition: 'all 0.15s',
  _hover: {
    bg: 'brand.600',
  },
  _active: {
    bg: 'brand.700',
    // transform: 'scale(0.95)',
  },
})

const DisabledButton = styled('button', {
  px: 6,
  py: 3,
  bg: 'gray.500',
  color: 'white',
  rounded: 'md',
  fontWeight: 'semibold',
  _disabled: {
    bg: 'gray.300',
    color: 'gray.500',
    cursor: 'not-allowed',
  },
})

export function PseudoSelectorsDemo() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Pseudo Selectors
      </Text>

      <Flex gap={6} flexDirection="column">
        {/* Hover State */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            :hover - Hover State
          </Text>
          <HoverBox>
            <Text fontWeight="medium">Hover over me!</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Background color changes on hover
            </Text>
          </HoverBox>
        </Box>

        {/* Focus State */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            :focus - Focus State
          </Text>
          <FocusInput
            type="text"
            placeholder="Click to focus - border changes color"
          />
          <Text fontSize="sm" color="gray.600" mt={2}>
            Border color changes when input is focused
          </Text>
        </Box>

        {/* Active State */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            :active - Active State
          </Text>
          <ActiveButton>Click and hold me</ActiveButton>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Button darkens when actively pressed
          </Text>
        </Box>

        {/* Disabled State */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            :disabled - Disabled State
          </Text>
          <Flex gap={3}>
            <DisabledButton>Enabled Button</DisabledButton>
            <DisabledButton disabled>Disabled Button</DisabledButton>
          </Flex>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Disabled button has reduced opacity and pointer-events disabled
          </Text>
        </Box>

        {/* Multiple Pseudo States Combined */}
        <Box p={6} bg="gray.100" rounded="lg">
          <Text fontWeight="semibold" mb={3}>
            ✨ All pseudo-selectors are fully type-safe
          </Text>
          <Text fontSize="sm" color="gray.600">
            ZenCSS supports _hover, _focus, _active, _disabled, and more. All
            with full TypeScript autocomplete and type checking.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
