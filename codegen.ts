import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.REACT_APP_GRAPHQL_HTTP
    ? process.env.REACT_APP_GRAPHQL_HTTP + '/graphql'
    : 'http://localhost:4000/graphql',
  documents: 'src/**/*.{tsx,ts}',
  // ignoreNoDocuments: true,
  generates: {
    'src/gql': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
