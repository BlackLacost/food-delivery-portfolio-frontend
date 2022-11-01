import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CreateAccountPage } from '../pages/CreateAccountPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { Yandex } from '../pages/Yandex'

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccountPage />} />
          <Route path="yandex" element={<Yandex />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
