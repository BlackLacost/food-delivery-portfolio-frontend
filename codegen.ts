import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.REACT_APP_GRAPHQL_HTTP
    ? process.env.REACT_APP_GRAPHQL_HTTP + '/graphql'
    : 'http://localhost:4000/graphql',
  documents: 'src/**/*.{tsx,ts}',
  generates: {
    'src/gql': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
