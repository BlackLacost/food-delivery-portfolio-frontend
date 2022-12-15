import { HTMLProps } from 'react'

type Props = HTMLProps<HTMLDivElement> & {
  isSelected?: boolean
}

export const DishCardContainer = ({ children, isSelected = false }: Props) => {
  return (
    <article
      className={`border py-4 px-8 transition-all  ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      {children}
    </article>
  )
}
