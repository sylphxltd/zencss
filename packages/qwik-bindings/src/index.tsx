/**
 * @sylphx/silk-qwik
 * Qwik bindings for Silk with resumability and zero hydration
 */

import { component$, useSignal, useTask$, type QwikIntrinsicElements, type Component } from '@builder.io/qwik'
import { createStyleSystem, type DesignConfig, type TypedStyleProps, type StyleSystem } from '@sylphx/silk'

export interface SilkQwikSystem<C extends DesignConfig> {
  /**
   * Create a styled Qwik component with resumability
   */
  styled: <E extends keyof QwikIntrinsicElements>(
    element: E,
    baseStyles?: TypedStyleProps<C>
  ) => Component<QwikIntrinsicElements[E] & TypedStyleProps<C>>

  /**
   * CSS function for generating class names
   */
  css: StyleSystem<C>['css']

  /**
   * Box primitive component
   */
  Box: Component<QwikIntrinsicElements['div'] & TypedStyleProps<C>>

  /**
   * Flex primitive component
   */
  Flex: Component<QwikIntrinsicElements['div'] & TypedStyleProps<C>>

  /**
   * Get all CSS rules
   */
  getCSSRules: StyleSystem<C>['getCSSRules']
}

/**
 * Create Silk system for Qwik with resumability
 *
 * @example
 * ```typescript
 * import { defineConfig } from '@sylphx/silk'
 * import { createSilkQwik } from '@sylphx/silk-qwik'
 *
 * export const { styled, Box, css } = createSilkQwik(
 *   defineConfig({
 *     colors: { brand: { 500: '#3b82f6' } },
 *     spacing: { 4: '1rem' }
 *   })
 * )
 * ```
 */
export function createSilkQwik<const C extends DesignConfig>(
  config: C
): SilkQwikSystem<C> {
  const styleSystem = createStyleSystem<C>(config)

  // Style prop names for extraction
  const stylePropNames = [
    'color', 'bg', 'backgroundColor', 'borderColor',
    'm', 'margin', 'mt', 'marginTop', 'mr', 'marginRight',
    'mb', 'marginBottom', 'ml', 'marginLeft',
    'p', 'padding', 'pt', 'paddingTop', 'pr', 'paddingRight',
    'pb', 'paddingBottom', 'pl', 'paddingLeft',
    'gap', 'w', 'width', 'h', 'height',
    'minW', 'minWidth', 'minH', 'minHeight',
    'maxW', 'maxWidth', 'maxH', 'maxHeight',
    'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign',
    'display', 'flexDirection', 'justifyContent', 'alignItems',
    'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow',
    'rounded', 'borderRadius', 'borderWidth',
    'opacity', 'shadow', 'boxShadow',
    '_hover', '_focus', '_active', '_disabled',
    'containerType', 'containerName', '@container', '@scope', '@starting-style',
    'viewTransitionName', 'contain'
  ] as const

  /**
   * Create a styled Qwik component
   *
   * Uses Qwik's resumability - style computation happens on server,
   * zero JavaScript shipped for styling on client
   */
  function styled<E extends keyof QwikIntrinsicElements>(
    element: E,
    baseStyles?: TypedStyleProps<C>
  ): Component<QwikIntrinsicElements[E] & TypedStyleProps<C>> {
    return component$((props: any) => {
      // Extract style props from component props
      const styleProps: Record<string, any> = {}
      const elementProps: Record<string, any> = {}

      for (const key in props) {
        if (stylePropNames.includes(key as any)) {
          styleProps[key] = props[key]
        } else {
          elementProps[key] = props[key]
        }
      }

      // Merge base styles with props
      const mergedStyles = { ...baseStyles, ...styleProps }

      // Generate className (happens on server, resumable on client)
      const className = styleSystem.css(mergedStyles as TypedStyleProps<C>).className

      // Create element with class
      const Element = element as any
      return (
        <Element {...elementProps} class={className}>
          {props.children}
        </Element>
      )
    })
  }

  // Create primitive components
  const Box = styled('div')
  const Flex = styled('div', { display: 'flex' })

  return {
    styled,
    css: styleSystem.css.bind(styleSystem),
    Box,
    Flex,
    getCSSRules: styleSystem.getCSSRules.bind(styleSystem),
  }
}

/**
 * Hook for reactive styles in Qwik
 * Leverages Qwik's fine-grained reactivity
 *
 * @example
 * ```typescript
 * const count = useSignal(0)
 * const dynamicClass = useSilkStyle(css, () => ({
 *   bg: count.value > 5 ? 'red.500' : 'blue.500'
 * }))
 * ```
 */
export function useSilkStyle<C extends DesignConfig>(
  css: StyleSystem<C>['css'],
  styleFn: () => TypedStyleProps<C>
) {
  const className = useSignal('')

  useTask$(({ track }) => {
    // Track style function dependencies
    const styles = styleFn()
    track(() => styles)

    // Generate className
    className.value = css(styles).className
  })

  return className
}

// Re-export core types
export type {
  DesignConfig,
  TypedStyleProps,
  StyleObject,
  CSSProperties,
} from '@sylphx/silk'

// Re-export core utilities
export * from '@sylphx/silk'
