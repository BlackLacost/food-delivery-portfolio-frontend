import { HTMLAttributes, MouseEvent } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  page: number
  totalPages: number
  onPrevPage: (e: MouseEvent<HTMLElement>) => void
  onNextPage: (e: MouseEvent<HTMLElement>) => void
}

export const Pagination = ({
  className,
  page,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  ...rest
}: Props) => {
  if (totalPages <= 1) return null

  return (
    <div
      className={`grid-x-5 mx-auto grid max-w-xs grid-cols-3 items-center ${className}`}
      {...rest}
    >
      {page > 1 ? (
        <button
          onClick={onPrevPage}
          className="rounded-full text-2xl focus:outline-none"
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span className="text-center">
        {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button
          className="rounded-full text-2xl focus:outline-none"
          onClick={onNextPage}
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  )
}
