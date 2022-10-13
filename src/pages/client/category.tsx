import { useParams } from 'react-router-dom'
import { useCategory } from '../../hooks/useCategory'

type Params = {
  slug: string
}

export default function Category() {
  const { slug } = useParams<Params>()
  const { data, loading } = useCategory({ slug: slug as string })
  console.log(data)
  return <div>Category</div>
}
