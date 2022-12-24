import { FetchPolicy, useQuery } from '@apollo/client'
import { graphql } from '../gql'

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
export const useMe = (fetchPolicy: FetchPolicy = 'cache-first') => {
  return useQuery(Me, { fetchPolicy })
}
