import { HTMLProps } from 'react'

type Props = HTMLProps<HTMLDivElement> & {
  isSelected?: boolean
}

export const DishCardContainer = ({ children, isSelected = false }: Props) => {
  return (
    <article
      className={`relative p-4 transition-all  ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      {children}
    </article>
  )
}
