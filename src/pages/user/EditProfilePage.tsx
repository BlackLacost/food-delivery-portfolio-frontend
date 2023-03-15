import { gql, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../components/Button'
import { H1 } from '../../components/H1'
import { Input } from '../../components/Input'
import { EditProfileForm, editProfileSchema } from '../../form.schemas'
import { graphql } from '../../gql'
import { useMe } from '../../hooks/useMe'

const EditProfile = graphql(`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

export const EditProfilePage = () => {
  // const { data: userData, refetch: refetchMe } = useMe()
  const { data: userData } = useMe()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EditProfileForm>({
    defaultValues: { email: userData?.me.email, password: null },
    resolver: yupResolver(editProfileSchema),
  })

  const [editProfile, { loading }] = useMutation(EditProfile, {
    update: async (cache, { data }) => {
      const error = data?.editProfile.error

      if (!error && userData) {
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
        <title>Редактирование Профиля | Доставка Еды</title>
      </Helmet>
      <H1 className="">Редактирование Профиля</H1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid w-full max-w-screen-sm gap-3"
      >
        <Input
          registerProps={register('email')}
          type="email"
          placeholder="Почта"
          error={errors.email}
        />
        <Input
          registerProps={register('password')}
          type="password"
          placeholder="Пароль"
          error={errors.password}
        />
        <Button loading={loading}>Сохранить</Button>
      </form>
    </div>
  )
}
