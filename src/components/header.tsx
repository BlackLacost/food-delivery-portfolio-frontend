import { FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Logo } from './logo'

export const Header = () => {
  return (
    <header className="py-4">
      <div className="mx-5 flex max-w-screen-xl items-center justify-between xl:mx-auto">
        <Logo className="w-52" />
        <Link to="/profile">
          <FaUserAlt size={30} />
        </Link>
      </div>
    </header>
  )
}
