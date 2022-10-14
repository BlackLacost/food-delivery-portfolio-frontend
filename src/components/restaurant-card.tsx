import { Link } from 'react-router-dom'

type Props = {
  categoryName?: string
  coverImage: string
  id: number
  name: string
}

export const RestaurantCard = ({
  categoryName,
  coverImage,
  id,
  name,
}: Props) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <article>
        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
          <img className="object-cover" src={coverImage} alt={categoryName} />
        </div>
        <h2 className="py-2 text-xl">{name}</h2>
        <p className="border-t-2 border-gray-200 pt-2 text-gray-500">
          {categoryName ?? 'Without Category'}
        </p>
      </article>
    </Link>
  )
}
