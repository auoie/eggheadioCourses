import { FC, HTMLProps } from 'react'
import { useColorModeValue } from '@chakra-ui/react'

const Option: FC<HTMLProps<HTMLOptionElement>> = ({ children, ...props }) => {
  const optionBg = useColorModeValue('white', 'black')
  return (
    <option style={{ backgroundColor: optionBg }} {...props}>
      {children}
    </option>
  )
}
export default Option
