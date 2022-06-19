import { FC } from 'react'
import { IconButton, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const ThemeToggle: FC = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Color mode switcher"
      icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
    />
  )
}
export default ThemeToggle
