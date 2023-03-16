import clsx from 'clsx'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { FormError } from './FormError'

interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    keyof UseFormRegisterReturn | 'size'
  > {
  error?: FieldError
  size?: 'default' | 'small'
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    { className, children, error, id, type, size = 'default', ...rest },
    ref
  ) => {
    return (
      <>
        <input
          className={clsx('input', className, {
            'py-2 text-sm': size === 'small',
            hidden: type === 'file',
          })}
          ref={ref}
          type={type}
          id={id}
          {...rest}
        />
        {type === 'file' && (
          <label htmlFor={id} className="input cursor-pointer text-gray-400">
            {children}
          </label>
        )}
        {error && <FormError>{error.message}</FormError>}
      </>
    )
  }
)
