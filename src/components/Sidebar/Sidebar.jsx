import { useDispatch, useSelector } from 'react-redux'
import { FaBarsStaggered } from 'react-icons/fa6'
import { MdSpaceDashboard, MdKeyboardArrowRight, MdLogout } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import BrandLogo from '../../assets/images/brands/brand.svg'
import { destroySession } from '../../redux/slices/AuthenticationSlice'

function Sidebar() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const userLogout = () => {
    dispatch(destroySession(activeToken))
  }

  return (
    <section>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2.5 mt-2 text-xl text-white border rounded-lg bg-purple ms-3 sm:hidden hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <FaBarsStaggered />
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto shadow-xl text-slate-400">
          <a href="/" className="flex items-center justify-center h-16 mb-1 text-center text-black">
            <img src={BrandLogo} alt="TramitesEC's logo" className="w-10 h-10" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">TrámitesEC</span>
          </a>
          <ul className="flex-1 mt-5 space-y-2 font-medium">
            {/* <li>
              <NavLink to="/" className="flex items-center p-2.5 text-sm rounded-lg md:hover:shadow-lg md:transition">
                <MdSpaceDashboard className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3">Dashboard</span>
                <MdKeyboardArrowRight className="w-5 h-5 transition duration-75" />
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/" className="flex items-center p-2.5 text-sm rounded-lg md:hover:shadow-lg md:transition">
                <FaUser className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3">Clientes</span>
                <MdKeyboardArrowRight className="w-5 h-5 transition duration-75" />
              </NavLink>
            </li>
          </ul>
          <button
            onClick={userLogout}
            type="button"
            className="flex items-center justify-center gap-1 p-2.5 px-5 text-xs font-medium text-white bg-red-600 rounded-lg sm:text-sm focus:outline-none hover:bg-red-700 md:hover:shadow-md md:active:scale-95 md:transition"
          >
            Cerrar Sesión
            <MdLogout className="flex-shrink-0 w-5 h-5 transition duration-75" />
          </button>
        </div>
      </aside>
    </section>
  )
}

export default Sidebar
