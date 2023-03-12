import { Link } from 'react-router-dom'
import { FragmentType, graphql, useFragment } from '../../gql'
import { Card_RestaurantFragmentDoc } from '../../gql/graphql'

graphql(`
  fragment Card_Restaurant on Restaurant {
    id
    category {
      name
    }
    coverImage
    name
  }
`)

type Props = {
  restaurant: FragmentType<typeof Card_RestaurantFragmentDoc>
}

export const RestaurantCard = ({ restaurant }: Props) => {
  const { id, category, coverImage, name } = useFragment(
    Card_RestaurantFragmentDoc,
    restaurant
  )
  return (
    <Link to={`/restaurant/${id}`}>
      <article className="group">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
          <img
            className="object-cover duration-1000 group-hover:scale-110"
            src={coverImage}
            alt={category?.name}
          />
        </div>
        <h2 className="py-2 text-xl">{name}</h2>
        {category?.name ? (
          <p className="border-t-2 border-gray-200 pt-2 text-gray-500">
            {category.name}
          </p>
        ) : null}
      </article>
    </Link>
  )
}
