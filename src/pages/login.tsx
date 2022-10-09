import { SubmitHandler, useForm } from 'react-hook-form'

interface LoginForm {
  email: string
  password: string
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log(data)
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-lg rounded-lg bg-white pt-5 pb-7 text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 grid gap-3 px-5"
        >
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 10,
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className="text-sm text-red-500">
              Password must be more than 10 chars
            </span>
          )}

          <button className="btn" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}
