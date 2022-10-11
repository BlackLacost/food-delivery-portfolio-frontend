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
        <div className="mx-5 mt-8 max-w-screen-xl xl:mx-auto">
          <div className="flex justify-center space-x-5">
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="flex h-16 w-16 flex-col rounded-full hover:bg-gray-200"
              >
                {category.coverImage && (
                  <img src={category.coverImage} alt={category.name} />
                )}
                <span className="text-center text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
