import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout'
import { UserRole } from '../gql/graphql'
import { useMe } from '../hooks/useMe'
import { NotFound } from '../pages/404'
import Category from '../pages/client/category'
import { Restaurants } from '../pages/client/restaurants'
import { Search } from '../pages/client/search'
import { ConfirmEmail } from '../pages/user/confirm-email'
import { EditProfile } from '../pages/user/edit-profile'

const ClientRoutes = () => {
  return (
    <>
      <Route index element={<Restaurants />} />
      <Route path="confirm" element={<ConfirmEmail />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="search" element={<Search />} />
      <Route path="category/:slug" element={<Category />} />
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
