import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { NotFoundPage } from '../pages/404'
import { CreateAccountPage } from '../pages/create-account'
import { LoginPage } from '../pages/login'

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
