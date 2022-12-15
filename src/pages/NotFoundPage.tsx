import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <Helmet>
        <title>Not Found | Доставка Еды</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p>The page you're looking for does not exist or has moved.</p>
      <Link to="/" className="text-primary-600 hover:underline">
        Go back Home &rarr;
      </Link>
    </div>
  )
}
