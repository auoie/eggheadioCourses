import { FC } from 'react'
import { Stack, StackProps } from '@chakra-ui/react'

const NavBar: FC<StackProps> = ({ children, ...rest }) => {
  return (
    <Stack
      as="nav"
      w={{ md: 'full' }}
      justifyContent={'space-between'}
      py={8}
      direction={{ base: 'column', md: 'row' }}
      {...rest}
    >
      {children}
    </Stack>
  )
}
export default NavBar
