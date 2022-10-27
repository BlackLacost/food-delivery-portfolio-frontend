import { useReactiveVar } from '@apollo/client'
import { isLoggedInVar } from '../apollo'
import { LoggedInRouter } from '../routers/LoggedInRouter'
import { LoggedOutRouter } from '../routers/LoggedOutRouter'

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}
