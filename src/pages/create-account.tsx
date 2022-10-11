import { gql, useMutation } from '@apollo/client'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { Logo } from '../components/logo'
import {
  CreateAccountInput,
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from '../gql/graphql'

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`

export const CreateAccount = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateAccountInput>({
    mode: 'onChange',
    defaultValues: { role: UserRole.Client },
  })

  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted: (data) => {
        const {
          createAccount: { ok, error },
        } = data
        if (ok) {
          navigate('/')
        }
      },
    }
  )

  const onSubmit: SubmitHandler<CreateAccountInput> = (data) => {
    if (!loading) {
      createAccountMutation({ variables: { createAccountInput: data } })
    }
  }
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      {/* TODO Fix warning when using helmet */}
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
            {...register('email', {
              required: 'Email is required',
              pattern:
                /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/,
            })}
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
            {...register('password', {
              required: 'Password is required',
              minLength: 3,
            })}
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
