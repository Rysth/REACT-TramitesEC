import { Button } from '@tremor/react'
import { destroySession } from '../../../redux/slices/AuthenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function SidebarLogout() {
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const activeToken = useSelector((store) => store.authentication.activeToken)
  const isCollapsed = useSelector((state) => state.shared.isSidebarCollapsed)

  const closeUserSession = () => dispatch(destroySession(activeToken)).then(() => navigator('/session'))

  return (
    <button className="w-full mt-2 btn btn-error !min-h-0 !h-[2.5rem]" onClick={closeUserSession}>
      {isCollapsed ? 'X' : 'Cerrar Sesión'}
    </button>
  )
}

export default SidebarLogout
