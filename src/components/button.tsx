import { FC, HTMLProps } from 'react'

type Props = HTMLProps<HTMLButtonElement> & {
  loading?: boolean
  canClick?: boolean
  type?: 'submit' | 'button'
}
export const Button: FC<Props> = ({
  children,
  loading = false,
  canClick = true,
  type = 'submit',
  className,
  ...rest
}) => {
  return (
    <button
      className={`bg-lime-600 py-4 px-6 text-lg font-medium text-white transition-colors hover:bg-lime-700 focus:bg-lime-700 focus:outline-none disabled:bg-gray-300 ${className}`}
      type={type}
      disabled={!canClick || loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
