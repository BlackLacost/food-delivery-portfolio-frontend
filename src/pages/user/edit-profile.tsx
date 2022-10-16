import { gql, useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../components/button'
import { H1 } from '../../components/h1'
import { EditProfileForm, editProfileSchema } from '../../form.schemas'
import { graphql } from '../../gql'
import { Me } from '../../routers/logged-in-router'

const EditProfile = graphql(`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`)

export const EditProfilePage = () => {
  // const { data: userData, refetch: refetchMe } = useMe()
  const { data: userData } = useQuery(Me)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<EditProfileForm>({
    mode: 'onChange',
    defaultValues: { email: userData?.me.email, password: null },
    resolver: yupResolver(editProfileSchema),
  })

  const [editProfile, { loading }] = useMutation(EditProfile, {
    update: async (cache, result) => {
      const ok = result.data?.editProfile.ok

      if (ok && userData) {
        // await refetchMe()
        const {
          me: { id, email: prevEmail },
        } = userData
        const newEmail = getValues('email')

        if (prevEmail !== newEmail) {
          cache.writeFragment({
            id: `User:${id}`,
            fragment: gql`
              fragment EditedUser on User {
                email
                verified
              }
            `,
            data: {
              email: newEmail,
              verified: false,
            },
          })
        }
      }
    },
  })

  if (watch('email') === '') {
    setValue('email', null, { shouldValidate: true })
  }
  if (watch('password') === '') {
    setValue('password', null, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<EditProfileForm> = ({ email, password }) => {
    editProfile({
      variables: {
        input: {
          ...(email && { email }),
          ...(password && { password }),
        },
      },
    })
  }

  return (
    <div className="mt-52 flex flex-col items-center justify-center px-5">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <H1 className="">Edit Profile</H1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid w-full max-w-screen-sm gap-3"
      >
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="input"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="input"
        />
        <Button canClick={isValid} loading={loading}>
          Save Profile
        </Button>
      </form>
    </div>
  )
}
