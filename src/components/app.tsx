import { useReactiveVar } from '@apollo/client'
import { isLoggedInVar } from '../apollo'
import { LoggedOutRouter } from '../routers/logged-out-router'
import { LoggedInRouter } from '../routers/LoggedInRouter'

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}
