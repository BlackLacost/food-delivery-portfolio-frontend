import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Layout } from '../components/layout'
import { UserRole } from '../gql/graphql'
import { useMe } from '../hooks/useMe'
import { Restaurants } from '../pages/client/restaurants'

const ClientRoutes = () => {
  return (
    <>
      <Route index element={<Restaurants />} />
    </>
  )
}

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe()

  if (!data || loading || error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    )
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {data.me.role === UserRole.Client && ClientRoutes()}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  )
}
