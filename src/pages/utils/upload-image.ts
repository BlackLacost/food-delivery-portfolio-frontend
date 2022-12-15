export const uploadImage = async (image: any) => {
  const actualImage = image
  const formBody = new FormData()
  formBody.append('file', actualImage)
  const response = await fetch(
    `${process.env.REACT_APP_GRAPHQL_HTTP}/uploads/`,
    {
      method: 'POST',
      body: formBody,
    }
  )
  const { url } = await response.json()
  return url
}
