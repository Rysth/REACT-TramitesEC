import { Button } from 'flowbite-react'
import { destroySession } from '../../../redux/slices/AuthenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function SidebarLogout() {
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const activeToken = useSelector((store) => store.authentication.activeToken)

  const closeUserSession = () => dispatch(destroySession(activeToken)).then(() => navigator('/'))

  return (
    <Button color="failure" className="w-full" onClick={closeUserSession}>
      Cerrar Sesión
    </Button>
  )
}

export default SidebarLogout
