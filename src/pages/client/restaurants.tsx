import { useRestaurantsPage } from '../../hooks/useRestaurantsPage'

export const Restaurants = () => {
  const { data, loading } = useRestaurantsPage()
  return (
    <div>
      <form className="w-hull flex items-center justify-center bg-gray-800 py-40">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="input w-3/12 rounded-md border-0"
        />
      </form>
      {!loading && (
        <div className="mx-5 max-w-screen-xl xl:mx-auto">
          <div className="my-6 flex justify-center space-x-5">
            {data?.allCategories.categories?.map((category) => (
              <div key={category.id} className="group flex flex-col">
                {category.coverImage && (
                  <div className="h-16 w-16 rounded-full group-hover:bg-gray-200">
                    <img src={category.coverImage} alt={category.name} />
                  </div>
                )}
                <span className="text-center text-sm">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="my-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
            {data?.restaurants.results?.map((restaurant) => (
              <article key={restaurant.id}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    className="object-cover"
                    src={restaurant.coverImage}
                    alt={restaurant.category?.name}
                  />
                </div>
                <h2 className="text-xl">{restaurant.name}</h2>
                <p className="border-t-2 border-gray-200">
                  {restaurant.category?.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
