import { FC, HTMLAttributes } from 'react'
import logo from '../images/logo.svg'

type Props = HTMLAttributes<HTMLImageElement> & {}

export const Logo: FC<Props> = ({ ...rest }) => {
  return <img src={logo} alt="Logo" {...rest} />
}
