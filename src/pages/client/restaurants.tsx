import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { MouseEvent, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Restaurant } from '../../components/restaurant'
import { SearchTermForm } from '../../form.validators'
import { useRestaurantsPage } from '../../hooks/useRestaurantsPage'

export const Restaurants = () => {
  const [page, setPage] = useState(1)
  const { data, loading } = useRestaurantsPage(page)

  const onNextPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v + 1)
  }
  const onPrevPage = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPage((v) => v - 1)
  }

  const { register, handleSubmit } = useForm<SearchTermForm>({
    resolver: classValidatorResolver(SearchTermForm),
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SearchTermForm> = ({ searchTerm }) => {
    navigate(`/search?term=${searchTerm}`)
  }

  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-hull flex items-center justify-center bg-gray-800 py-40"
      >
        <input
          {...register('searchTerm')}
          type="text"
          placeholder="Search restaurants..."
          className="input w-3/4 rounded-md border-0 md:w-5/12 lg:w-4/12"
        />
      </form>
      {!loading && (
        <div className="mx-5 max-w-screen-xl xl:mx-auto">
          <div className="my-6 flex justify-center space-x-5">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="group flex flex-col">
                  {category.coverImage && (
                    <div className="h-16 w-16 rounded-full group-hover:bg-gray-200">
                      <img src={category.coverImage} alt={category.name} />
                    </div>
                  )}
                  <span className="text-center text-sm">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="my-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                categoryName={restaurant.category?.name}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
              />
            ))}
          </div>
          <div className="grid-x-5 my-5 mx-auto grid max-w-xs grid-cols-3 items-center">
            {page > 1 ? (
              <button
                onClick={onPrevPage}
                className="rounded-full text-2xl focus:outline-none"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-center">
              {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                className="rounded-full text-2xl focus:outline-none"
                onClick={onNextPage}
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
