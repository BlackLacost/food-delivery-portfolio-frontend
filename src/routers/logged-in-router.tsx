import { useQuery } from '@apollo/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout'
import { graphql } from '../gql'
import { UserRole } from '../gql/graphql'
import { NotFoundPage } from '../pages/404'
import CategoryPage from '../pages/client/category'
import RestaurantPage from '../pages/client/restaurant'
import { RestaurantsPage } from '../pages/client/restaurants'
import { SearchPage } from '../pages/client/search'
import { MyRestaurantsPage } from '../pages/owner/my-restaurants'
import { ConfirmEmailPage } from '../pages/user/confirm-email'
import { EditProfilePage } from '../pages/user/edit-profile'

export const Me = graphql(`
  query Me {
    me {
      id
      email
      role
      verified
    }
  }
`)

const CommonRoutes = () => {
  return (
    <>
      <Route path="confirm" element={<ConfirmEmailPage />} />
      <Route path="edit-profile" element={<EditProfilePage />} />
    </>
  )
}

const ClientRoutes = () => {
  return (
    <>
      <Route index element={<RestaurantsPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="category/:slug" element={<CategoryPage />} />
      <Route path="restaurant/:id" element={<RestaurantPage />} />
    </>
  )
}

const OwnerRoutes = () => {
  return (
    <>
      <Route index element={<MyRestaurantsPage />} />
    </>
  )
}

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery(Me)

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
          {CommonRoutes()}
          {data.me.role === UserRole.Client && ClientRoutes()}
          {data.me.role === UserRole.Owner && OwnerRoutes()}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}
