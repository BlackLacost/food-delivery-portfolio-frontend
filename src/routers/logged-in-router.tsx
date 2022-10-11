import { gql, useQuery } from '@apollo/client'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { MeQuery, UserRole } from '../gql/graphql'
import { Restaurants } from '../pages/client/restaurants'

const ClientRoutes = [<Route path="/" element={<Restaurants />} />]

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
      verified
    }
  }
`

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY)

  if (!data || loading || error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    )
  }
  console.log(data.me.role)
  return (
    <Router>
      <Routes>
        {data.me.role === UserRole.Client && ClientRoutes}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
