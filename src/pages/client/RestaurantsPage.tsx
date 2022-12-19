import { useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { MouseEvent, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '../../components/Pagination'
import { CategoryCard } from '../../features/restaurant/CategoryCard'
import { RestaurantsCards } from '../../features/restaurant/RestaurantsCards'
import { SearchTermForm, searchTermSchema } from '../../form.schemas'
import { graphql } from '../../gql'

const GetRestaurants_Query = graphql(`
  query GetRestaurants_Query($input: RestaurantsInput!) {
    allCategories {
      categories {
        id
        ...Card_CategoryFragment
      }
    }
    getRestaurants(input: $input) {
      totalPages
    }
    ...Restaurants_QueryFragment
  }
`)

export const RestaurantsPage = () => {
  const [page, setPage] = useState(1)
  const { data, loading } = useQuery(GetRestaurants_Query, {
    variables: { input: { page } },
  })

  const onNextPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v + 1)
  }
  const onPrevPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v - 1)
  }

  const { register, handleSubmit } = useForm<SearchTermForm>({
    resolver: yupResolver(searchTermSchema),
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SearchTermForm> = ({ searchTerm }) => {
    navigate(`/search?term=${searchTerm}`)
  }

  return (
    <div>
      <Helmet>
        <title>Home | Доставка Еды</title>
      </Helmet>
      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-hull flex items-center justify-center bg-gray-800 py-40"
      >
        <input
          {...register('searchTerm')}
          type="text"
          placeholder="Search restaurants..."
          className="input w-3/4 rounded-md border-0 md:w-5/12 lg:w-4/12"
        />
      </form> */}
      {!loading && data && (
        <div className="mx-5 max-w-screen-xl xl:mx-auto">
          <div className="my-6 flex justify-center space-x-5">
            {data.allCategories.categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <RestaurantsCards
            className="my-6"
            clientQuery={data}
            ownerQuery={undefined}
          />
          <Pagination
            className="my-6"
            page={page}
            totalPages={data.getRestaurants.totalPages ?? 1}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        </div>
      )}
    </div>
  )
}
