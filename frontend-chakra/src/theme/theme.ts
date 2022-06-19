import {
  ColorMode,
  extendTheme,
  Theme,
  ThemeConfig,
  withDefaultColorScheme
} from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'light'
}

const customTheme: Partial<Theme> = {
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        colorScheme: mode('light', 'dark')(props)
      },
      body: {
        bgColor: mode('white', 'black')(props)
      },
      '.courseCard': {
        borderColor: mode('gray.200', 'gray.900')(props)
      },
      '.courseCard:hover': {
        color: mode('black', 'white')(props)
      },
      '.courseCardTop': {
        bgColor: mode('gray.200', 'gray.900')(props)
      },
      '.courseCardHeading': {
        color: mode('black', 'white')(props)
      },
      '.courseCardGrid': {
        color: mode('gray.600', 'gray.300')(props)
      }
    })
  },
  components: {
    Popover: {
      baseStyle: (props: StyleFunctionProps) => ({
        content: {
          bgColor: mode('white', 'black')(props)
        }
      })
    }
  } as any
}
const theme = extendTheme(customTheme)
export default theme
