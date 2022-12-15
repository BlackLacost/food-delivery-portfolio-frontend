import React, { HTMLAttributes } from 'react'
import { Rub } from '../../../components/Rub'

type Props = HTMLAttributes<HTMLParagraphElement>

export const DishCardPrice: React.FC<Props> = ({ children }) => {
  return (
    <p className="text-center text-2xl font-semibold text-primary-600">
      {children} <Rub />
    </p>
  )
}
