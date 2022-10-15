import { gql } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../header'

describe('<RestaurantCard />', () => {
  // TODO: doesn't work properly
  it('renders OK with props', async () => {
    // const me = { id: 1, email: '', role: '', verified: true }
    const meMock = {
      request: {
        query: gql`
          query Me {
            me {
              id
              email
              role
              verified
            }
          }
        `,
      },
      result: {
        data: { id: 1, email: '', role: '', verified: true },
      },
    }
    render(
      <BrowserRouter>
        <MockedProvider mocks={[meMock]} addTypename={false}>
          <Header />
        </MockedProvider>
      </BrowserRouter>
    )
    expect(
      await screen.findByText('Please verify your email.')
    ).toBeInTheDocument()
  })
})
