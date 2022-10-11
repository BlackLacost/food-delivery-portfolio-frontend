import { useRestaurantsPage } from '../../hooks/useRestaurantsPage'

export const Restaurants = () => {
  const { data, loading, error } = useRestaurantsPage()
  return <h1>Restaurants</h1>
}
