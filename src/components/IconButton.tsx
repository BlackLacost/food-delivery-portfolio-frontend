import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { IoLogOut } from 'react-icons/io5'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: 'plus' | 'minus' | 'logout'
}

export const IconButton: FC<Props> = ({ icon, ...rest }) => {
  return (
    <button {...rest}>
      {icon === 'plus' ? (
        <AiFillPlusCircle className="h-10 w-10 text-primary-600" />
      ) : icon === 'minus' ? (
        <AiFillMinusCircle className="h-10 w-10 text-danger-600" />
      ) : icon === 'logout' ? (
        <IoLogOut size={43} />
      ) : null}
    </button>
  )
}
