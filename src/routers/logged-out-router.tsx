import { isLoggedInVar } from '../apollo'

export const LoggedOutRouter = () => {
  const onClick = () => isLoggedInVar(true)
  return (
    <div>
      <h1>Logged Out</h1>
      <button onClick={onClick}>Log In</button>
    </div>
  )
}
