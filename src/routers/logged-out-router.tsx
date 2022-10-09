import { SubmitHandler, useForm } from 'react-hook-form'
import { isLoggedInVar } from '../apollo'

interface LoginForm {
  email: string
  password: string
}

export const LoggedOutRouter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log(data)
    isLoggedInVar(true)
  }

  const onInvalid = () => {
    console.log("can't create account")
  }
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register('email', {
              required: 'This is required',
              pattern: /^[a-zA-Z0-9._%+-]+@gmail.com/,
            })}
            type="email"
            placeholder="email"
          />
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email.message}
            </span>
          )}
          {errors.email?.type === 'pattern' && (
            <span className="font-bold text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="password"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-yellow-300 text-gray-500">
          Log In
        </button>
      </form>
    </div>
  )
}
