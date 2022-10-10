import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const FormError: FC<Props> = ({ children }) => {
  return <span className="pl-3 text-sm text-red-500">{children}</span>
}
