import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  restaurantsCount: number
}

export const AddRestaurantButton: React.FC<Props> = ({ restaurantsCount }) => {
  return (
    <div>
      {restaurantsCount < 1 && (
        <p className="mb-5 text-xl">У вас еще нет ресторана. Добавьте его!</p>
      )}
      <Link className="link text-lime-600" to="/add-restaurant">
        Добавить ресторан &rarr;
      </Link>
    </div>
  )
}
