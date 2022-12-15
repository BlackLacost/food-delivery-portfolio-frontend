import { Link } from 'react-router-dom'
import { FragmentType, graphql, useFragment } from '../../gql'

export const Card_RestaurantFragment = graphql(`
  fragment Card_RestaurantFragment on Restaurant {
    id
    category {
      name
    }
    coverImage
    name
  }
`)

type Props = {
  restaurant: FragmentType<typeof Card_RestaurantFragment>
}

export const RestaurantCard = ({ restaurant }: Props) => {
  const { id, category, coverImage, name } = useFragment(
    Card_RestaurantFragment,
    restaurant
  )
  return (
    <Link to={`/restaurant/${id}`}>
      <article>
        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
          <img className="object-cover" src={coverImage} alt={category?.name} />
        </div>
        <h2 className="py-2 text-xl">{name}</h2>
        <p className="border-t-2 border-gray-200 pt-2 text-gray-500">
          {category?.name ?? 'Without Category'}
        </p>
      </article>
    </Link>
  )
}
