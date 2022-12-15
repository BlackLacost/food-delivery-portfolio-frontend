import { Link } from 'react-router-dom'
import { FragmentType, graphql, useFragment } from '../../gql'

export const Card_CategoryFragment = graphql(`
  fragment Card_CategoryFragment on Category {
    id
    coverImage
    name
    slug
  }
`)

type Props = {
  category: FragmentType<typeof Card_CategoryFragment>
}

export const CategoryCard = ({ category }: Props) => {
  const { id, coverImage, name, slug } = useFragment(
    Card_CategoryFragment,
    category
  )
  return (
    <Link key={id} to={`/category/${slug}`}>
      <div className="group flex flex-col">
        {coverImage && (
          <div className="h-16 w-16 rounded-full group-hover:bg-gray-200">
            <img src={coverImage} alt={name} />
          </div>
        )}
        <span className="text-center text-sm">{name}</span>
      </div>
    </Link>
  )
}
