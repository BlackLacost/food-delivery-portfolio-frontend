import { render } from '@testing-library/react'
import { FormError } from '../form-error'

describe('<FormError />', () => {
  it('renders OK with props', () => {
    const { getByText } = render(<FormError>test</FormError>)

    getByText('test')
  })
})
