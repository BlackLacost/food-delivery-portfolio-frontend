import { toast } from 'react-toastify'

export const notify = {
  error(message: string) {
    toast.error(message, {
      autoClose: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      position: 'top-center',
    })
  },
  success(message: string) {
    toast.success(message, {
      autoClose: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      position: 'top-center',
    })
  },
}
