import clsx from 'clsx'
import { FC, HTMLAttributes } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { FormError } from './FormError'

interface Props
  extends Omit<HTMLAttributes<HTMLInputElement>, keyof UseFormRegisterReturn> {
  registerProps: UseFormRegisterReturn
  error?: FieldError
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  min?: number
}

export const Input: FC<Props> = ({
  registerProps,
  className,
  error,
  type = 'text',
  ...rest
}) => {
  return (
    <>
      <input
        className={clsx('input', className)}
        {...registerProps}
        {...rest}
      />
      {error && <FormError>{error.message}</FormError>}
    </>
  )
}
