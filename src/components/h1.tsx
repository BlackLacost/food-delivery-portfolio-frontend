import { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode
}

export const H1 = ({ children, className, ...rest }: Props) => {
  return (
    <h1 className={`text-2xl ${className}`} {...rest}>
      {children}
    </h1>
  )
}
