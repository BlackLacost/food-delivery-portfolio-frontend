import { FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLImageElement> & {}

export const Logo: FC<Props> = ({ ...rest }) => {
  return (
    <div {...rest}>
      <p className={`font-logo text-3xl`}>Доставка Еды</p>
      <p className="text-sm">(портфолио)</p>
    </div>
  )
}
