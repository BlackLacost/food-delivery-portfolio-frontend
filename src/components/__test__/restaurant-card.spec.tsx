import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RestaurantCard } from '../restaurant-card'

describe('<RestaurantCard />', () => {
  it('renders OK with props', () => {
    const restaurantProps = {
      id: 1,
      name: 'nameTest',
      categoryName: 'categoryTest',
      coverImage: 'http://image.test',
    }
    const { debug, getByText, container } = render(
      <Router>
        <RestaurantCard {...restaurantProps} />
      </Router>
    )

    debug()
    getByText(restaurantProps.name)
    getByText(restaurantProps.categoryName)
    expect(container.firstChild).toHaveAttribute(
      'href',
      `/restaurant/${restaurantProps.id}`
    )
  })
})
