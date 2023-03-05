import { useQuery } from '@apollo/client'
import { MouseEvent, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Pagination } from '../../components/Pagination'
import { CategoryCard } from '../../features/restaurant/CategoryCard'
import { RestaurantCard } from '../../features/restaurant/RestaurantCard'
import { graphql } from '../../gql'
import { GetRestaurantsDocument } from '../../gql/graphql'
import { notify } from '../../toast'

graphql(`
  query GetRestaurants($input: RestaurantsInput!) {
    allCategories {
      categories {
        id
        ...Card_CategoryFragment
      }
    }
    getRestaurants(input: $input) {
      totalPages
      restaurants {
        id
        ...Card_Restaurant
      }
    }
  }
`)

export const RestaurantsPage = () => {
  const [page, setPage] = useState(1)
  const { data, loading } = useQuery(GetRestaurantsDocument, {
    variables: { input: { page } },
    onError: (error) => {
      notify.error(error.message)
    },
  })

  const onNextPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v + 1)
  }
  const onPrevPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v - 1)
  }

  // const { register, handleSubmit } = useForm<SearchTermForm>({
  //   resolver: yupResolver(searchTermSchema),
  // })
  // const navigate = useNavigate()
  //
  // const onSubmit: SubmitHandler<SearchTermForm> = ({ searchTerm }) => {
  //   navigate(`/search?term=${searchTerm}`)
  // }

  if (loading) return null
  if (!data?.allCategories.categories || !data.getRestaurants.restaurants)
    return null

  const { categories } = data.allCategories
  const { restaurants, totalPages } = data.getRestaurants

  return (
    <div>
      <Helmet>
        <title>Home | Доставка Еды</title>
      </Helmet>
      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center py-40 bg-gray-800 w-hull"
      >
        <input
          {...register('searchTerm')}
          type="text"
          placeholder="Search restaurants..."
          className="w-3/4 border-0 rounded-md input md:w-5/12 lg:w-4/12"
        />
      </form> */}
      <div className="mx-5 max-w-screen-xl xl:mx-auto">
        <div className="my-6 flex justify-center space-x-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <div
          className={`my-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3`}
        >
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        <Pagination
          className="my-6"
          page={page}
          totalPages={totalPages ?? 1}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      </div>
    </div>
  )
}
