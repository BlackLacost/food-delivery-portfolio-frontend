import { FC, ReactNode } from 'react'

interface Props {
  loading?: boolean
  canClick?: boolean
  children: ReactNode
}
export const Button: FC<Props> = ({
  children,
  loading = false,
  canClick = true,
}) => {
  return (
    <button
      className="bg-lime-600 py-4 text-lg font-medium text-white transition-colors hover:bg-lime-700 focus:bg-lime-700 focus:outline-none disabled:bg-gray-300"
      type="submit"
      disabled={!canClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
