import { useQuery } from '@apollo/client'
import { FaUserAlt } from 'react-icons/fa'
import { IoLogOut } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { LOCALSTORAGE_TOKEN } from '../constants'
import { Me } from '../routers/LoggedInRouter'
import { Logo } from './Logo'

export const Header = () => {
  const { data } = useQuery(Me)

  const logout = () => {
    localStorage.setItem(LOCALSTORAGE_TOKEN, '')
    authTokenVar(null)
    isLoggedInVar(false)
  }

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
          <div className="flex items-center space-x-4">
            <Link to="/edit-profile">
              <FaUserAlt size={30} />
            </Link>
            <button type="button" onClick={logout}>
              <IoLogOut size={43} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
