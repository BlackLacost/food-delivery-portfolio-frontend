import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { graphql } from '../../gql'

const MyRestaurantRoute_Query = graphql(`
  query MyRestaurant_Query($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      result {
        name
      }
    }
  }
`)

type Params = {
  id: string
}

export const MyRestaurantPage = () => {
  const { id } = useParams<Params>()
  const { data } = useQuery(MyRestaurantRoute_Query, {
    variables: { input: { id: Number(id) } },
  })
  console.log(data)
  return <div>my restuarant</div>
}
