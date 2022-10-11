import { FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useMe } from '../hooks/useMe'
import { Logo } from './logo'

export const Header = () => {
  const { data } = useMe()
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-sm text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="mx-5 flex max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link to="/">
            <Logo className="w-52" />
          </Link>
          <Link to="/edit-profile">
            <FaUserAlt size={30} />
          </Link>
        </div>
      </header>
    </>
  )
}
