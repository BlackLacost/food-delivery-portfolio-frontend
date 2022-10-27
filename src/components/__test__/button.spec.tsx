import { render } from '@testing-library/react'
import { Button } from '../Button'

describe('<Button />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <Button canClick={true} loading={false}>
        test
      </Button>
    )

    getByText('test')
  })

  it('should display loading', () => {
    const { getByText } = render(<Button loading={true}>test</Button>)

    getByText('Loading...')
  })

  it('should disabled when loading', () => {
    const { getByText } = render(<Button loading={true}>test</Button>)

    expect(getByText('Loading...').closest('button')).toHaveAttribute(
      'disabled'
    )
  })

  it('should disabled', () => {
    const { getByText } = render(<Button canClick={false}>test</Button>)

    expect(getByText('test').closest('button')).toHaveAttribute('disabled')
  })

  it('should enable', () => {
    const { getByText } = render(<Button canClick={true}>test</Button>)

    expect(getByText('test').closest('button')).not.toHaveAttribute('disabled')
  })
})
