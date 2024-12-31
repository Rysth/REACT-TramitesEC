import { Button } from '@tremor/react'
import { destroySession } from '../../../redux/slices/AuthenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function SidebarLogout() {
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const activeToken = useSelector((store) => store.authentication.activeToken)

  const closeUserSession = () => dispatch(destroySession(activeToken)).then(() => navigator('/session'))

  return (
    <button className="w-full btn btn-error" onClick={closeUserSession}>
      Cerrar Sesión
    </button>
  )
}

export default SidebarLogout
