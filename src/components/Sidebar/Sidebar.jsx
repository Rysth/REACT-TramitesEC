import { useDispatch, useSelector } from 'react-redux'
import { FaBarsStaggered } from 'react-icons/fa6'
import { MdKeyboardArrowRight, MdLogout } from 'react-icons/md'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { Button } from 'flowbite-react'
import BrandLogo from '../../assets/images/brands/brand.svg'
import { destroySession } from '../../redux/slices/AuthenticationSlice'

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { activeToken } = useSelector((store) => store.authentication)

  const userLogout = () => {
    dispatch(destroySession(activeToken))
      .then(() => navigate('/session'))
      .then(() =>
        setTimeout(() => {
          window.location.reload()
        }, 500),
      )
  }

  return (
    <section>
      <Button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        color="dark"
        className="mt-3 button ms-3 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <FaBarsStaggered />
      </Button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto shadow-xl text-slate-400">
          <a href="/" className="flex items-center justify-center h-16 mb-1 text-center text-black">
            <img src={BrandLogo} alt="TramitesEC's logo" className="w-10 h-10" />
            <h2 className="self-center text-3xl whitespace-nowrap">TrámitesEC</h2>
          </a>
          <ul className="flex-1 mt-5 space-y-2 font-medium">
            <li>
              <NavLink to="/" className="flex items-center p-2.5 text-sm rounded-lg md:hover:shadow-lg md:transition">
                <FaUser className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3">Clientes</span>
                <MdKeyboardArrowRight className="w-5 h-5 transition duration-75" />
              </NavLink>
            </li>
          </ul>
          <Button color="failure" onClick={userLogout} className="button" size="sm">
            <MdLogout className="flex-shrink-0 w-5 h-5 transition duration-75" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </section>
  )
}

export default Sidebar
