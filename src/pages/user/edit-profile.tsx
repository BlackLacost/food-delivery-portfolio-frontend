import { gql, useMutation } from '@apollo/client'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../components/button'
import { H1 } from '../../components/h1'
import { EditProfileForm } from '../../form.validators'
import {
  EditProfileInput,
  EditProfileMutation,
  EditProfileMutationVariables,
} from '../../gql/graphql'
import { useMe } from '../../hooks/useMe'

const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`

export const EditProfile = () => {
  // const { data: userData, refetch: refetchMe } = useMe()
  const { data: userData } = useMe()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<EditProfileInput>({
    mode: 'onChange',
    defaultValues: { email: userData?.me.email, password: null },
    resolver: classValidatorResolver(EditProfileForm),
  })

  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
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

  const onSubmit: SubmitHandler<EditProfileInput> = ({ email, password }) => {
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
