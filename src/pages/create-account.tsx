import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { Logo } from '../components/logo'
import { CreateAccountForm, createAccountSchema } from '../form.schemas'
import { graphql } from '../gql'
import { UserRole } from '../gql/graphql'

const CreateAccount = graphql(`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`)

export const CreateAccountPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateAccountForm>({
    mode: 'onChange',
    defaultValues: { role: UserRole.Client },
    resolver: yupResolver(createAccountSchema),
  })

  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation(CreateAccount, {
    onCompleted: (data) => {
      if (data.createAccount.ok) {
        navigate('/')
      }
    },
  })

  const onSubmit: SubmitHandler<CreateAccountForm> = (data) => {
    if (!loading) {
      createAccountMutation({ variables: { createAccountInput: data } })
    }
  }
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Logo className="mb-10 w-60" />
        <div className="w-full text-left text-3xl font-medium">
          Let's get started
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 grid w-full gap-3 text-left"
        >
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError>{errors.email.message}</FormError>
          )}
          {errors.email?.type === 'pattern' && (
            <FormError>Please enter a valid email</FormError>
          )}
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError>{errors.password.message}</FormError>
          )}
          <select {...register('role')} className="input">
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <Button canClick={isValid} loading={loading}>
            Create Account
          </Button>
          {createAccountMutationResult?.createAccount.error && (
            <FormError>
              {createAccountMutationResult.createAccount.error}
            </FormError>
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  )
}
