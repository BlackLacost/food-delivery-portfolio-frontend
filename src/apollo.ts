import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { LOCALSTORAGE_TOKEN } from './constants'

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
export const isLoggedInVar = makeVar(Boolean(token))
export const authTokenVar = makeVar(token)

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_GRAPHQL_WS + '/graphql',
    connectionParams: {
      'x-jwt': authTokenVar() || '',
    },
  })
)

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_HTTP + '/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() ?? '',
    },
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const client = new ApolloClient({
  link: splitLink,
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar()
            },
          },
          token: {
            read() {
              return authTokenVar()
            },
          },
        },
      },
    },
  }),
})
