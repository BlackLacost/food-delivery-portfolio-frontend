import React, { HTMLProps } from 'react'
import { Button } from '../../components/Button'

type Props = HTMLProps<HTMLButtonElement> & {
  onClick(): void
}

export const OrderButton: React.FC<Props> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <Button className={`my-4 w-full py-4 ${className ?? ''}`} onClick={onClick}>
      {children}
    </Button>
  )
}
