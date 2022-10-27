import { useQuery } from '@apollo/client'
import { FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Me } from '../routers/LoggedInRouter'
import { Logo } from './logo'

export const Header = () => {
  const { data } = useQuery(Me)
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-sm text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="container flex items-center justify-between">
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
