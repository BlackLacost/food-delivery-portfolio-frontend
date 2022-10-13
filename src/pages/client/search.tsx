import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazySearchRestaurant } from '../../hooks/useLazySearchRestaurant'

export const Search = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [lazySearchRestaurant, { data, loading }] = useLazySearchRestaurant()
  console.log(loading, data)

  useEffect(() => {
    const query = searchParams.get('term')
    if (!query) {
      navigate('/', { replace: true })
      return
    }
    lazySearchRestaurant({ variables: { input: { query } } })
  }, [lazySearchRestaurant, searchParams, navigate])

  return (
    <h1>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      Search Page
    </h1>
  )
}
