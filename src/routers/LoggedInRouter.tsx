import { useQuery } from '@apollo/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { graphql } from '../gql'
import { UserRole } from '../gql/graphql'
import { CategoryPage } from '../pages/client/CategoryPage'
import { ClientOrdersPage } from '../pages/client/ClientOrdersPage'
import { RestaurantPage } from '../pages/client/RestaurantPage'
import { RestaurantsPage } from '../pages/client/RestaurantsPage'
import { SearchPage } from '../pages/client/SearchPage'
import { Dashboard } from '../pages/driver/Dashboard'
import { DriverOrderPage } from '../pages/driver/DriverOrderPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AddDishPage } from '../pages/owner/AddDishPage'
import { AddRestaurantPage } from '../pages/owner/AddRestaurantPage'
import { MyRestaurantPage } from '../pages/owner/MyRestaurantPage'
import { MyRestaurantsPage } from '../pages/owner/MyRestaurantsPage'
import { OwnerOrderPage } from '../pages/owner/OwnerOrderPage'
import { OwnerOrdersPage } from '../pages/owner/OwnerOrdersPage'
import { ConfirmEmailPage } from '../pages/user/ConfirmEmailPage'
import { EditProfilePage } from '../pages/user/EditProfilePage'

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
      <Route path="orders" element={<ClientOrdersPage />} />
    </>
  )
}

const OwnerRoutes = () => {
  return (
    <>
      <Route index element={<MyRestaurantsPage />} />
      <Route path="add-restaurant" element={<AddRestaurantPage />} />
      <Route path="restaurant/:id" element={<MyRestaurantPage />} />
      <Route path="restaurant/:id/add-dish" element={<AddDishPage />} />
      <Route path="order/:id" element={<OwnerOrderPage />} />
      <Route path="restaurant/:id/orders" element={<OwnerOrdersPage />} />
      <Route path="order/:id" element={<OwnerOrderPage />} />
    </>
  )
}

const DriverRoutes = () => {
  return (
    <>
      <Route index element={<Dashboard />} />
      <Route path="order/:id" element={<DriverOrderPage />} />
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
          {data.me.role === UserRole.Driver && DriverRoutes()}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}
