import { useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CoreRestaurantFieldsFragment } from '../../fragments'
import { FragmentType, graphql, useFragment } from '../../gql'

const SearchRestaurant = graphql(`
  query SearchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...CoreRestaurantFields
      }
    }
  }
`)

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchRestaurant, { data, loading }] = useLazyQuery(SearchRestaurant)
  const restaraunts = useFragment(
    CoreRestaurantFieldsFragment,
    data?.searchRestaurant.restaurants as FragmentType<
      typeof CoreRestaurantFieldsFragment
    >[]
  )
  console.log(loading, { data }, { restaraunts })

  useEffect(() => {
    const query = searchParams.get('term')
    if (!query) {
      navigate('/', { replace: true })
      return
    }
    searchRestaurant({ variables: { input: { query } } })
  }, [searchRestaurant, searchParams, navigate])

  return (
    <h1>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      Search Page
    </h1>
  )
}
