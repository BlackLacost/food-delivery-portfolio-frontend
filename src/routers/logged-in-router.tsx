import { gql, useQuery } from '@apollo/client'
import { isLoggedInVar } from '../apollo'
import { MeQuery } from '../gql/graphql'

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
  const onClick = () => isLoggedInVar(false)

  if (!data || loading || error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    )
  }
  return (
    <div>
      <h1>{data?.me.email}</h1>
      <button onClick={onClick}>Log Out</button>
    </div>
  )
}
