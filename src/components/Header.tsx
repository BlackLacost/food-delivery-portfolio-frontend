import { BiDish } from 'react-icons/bi'
import { FaUserAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { authTokenVar, client, isLoggedInVar } from '../apollo'
import { LOCALSTORAGE_TOKEN } from '../constants'
import { UserRole } from '../gql/graphql'
import { useMe } from '../hooks/useMe'
import { IconButton } from './IconButton'
import { Logo } from './Logo'

export const Header = () => {
  const { data } = useMe()
  const navigate = useNavigate()

  const logout = () => {
    client.clearStore()
    localStorage.removeItem(LOCALSTORAGE_TOKEN)
    authTokenVar(null)
    isLoggedInVar(false)
    navigate('/')
  }

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-sm text-white">
          <span>Пожалуйства подтвердите почту.</span>
        </div>
      )}
      <header className="py-2">
        <div className="container flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center space-x-4">
            {data?.me.role === UserRole.Client && (
              <Link to="/orders">
                <BiDish size={40} />
              </Link>
            )}
            <Link to="/edit-profile">
              <FaUserAlt size={30} />
            </Link>
            <IconButton icon="logout" type="button" onClick={logout} />
          </div>
        </div>
      </header>
    </>
  )
}
