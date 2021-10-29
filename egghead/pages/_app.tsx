import type { AppProps } from 'next/app'
import { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../src/theme/theme'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
