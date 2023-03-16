import { clsx } from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'
import { Spinner } from './Spinner'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
  canClick?: boolean
  href?: 'string'
  size?: 'default' | 'small'
  color?: 'primary' | 'secondary' | 'warning'
}

export const Button: FC<Props> = ({
  children,
  href,
  loading = false,
  canClick = true,
  size = 'default',
  color = 'primary',
  className,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        'bg-primary-600 py-4 px-6 text-lg font-medium text-white transition-colors hover:bg-primary-700 focus:bg-primary-700 focus:outline-none disabled:bg-primary-700',
        {
          'py-1 text-base': size === 'small',
          'bg-gray-900 hover:bg-gray-700 focus:bg-gray-700':
            color === 'secondary',
          'bg-red-500 hover:bg-red-600 focus:bg-red-600': color === 'warning',
        },
        className
      )}
      disabled={!canClick || loading}
      {...rest}
    >
      <div className="flex justify-center">
        {loading && <Spinner />}
        {children}
      </div>
    </button>
  )
}
