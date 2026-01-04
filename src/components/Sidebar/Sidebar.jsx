import { Button } from 'flowbite-react'
import { useState } from 'react'
import { FaCar, FaIdCard } from 'react-icons/fa'
import {
  IoChevronBackOutline,
  IoPeople,
  IoPerson,
  IoBusiness,
  IoList,
  IoHome,
  IoMenu,
  IoSchool
} from 'react-icons/io5'
import { NavLink, useLocation } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'
import { useDispatch, useSelector } from 'react-redux'
import { sharedActions } from '../../redux/slices/SharedSlice'

function Sidebar() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { activeUser } = useSelector((state) => state.authentication)
  const isCollapsed = useSelector((state) => state.shared.isSidebarCollapsed)
  const isAdmin = activeUser.is_admin
  const [open, setOpen] = useState(false) // Initialize as false

  const openSideBar = () => setOpen(true)
  const closeSideBar = () => setOpen(false)
  const toggleCollapse = () => {
    dispatch(sharedActions.toggleSidebar())
  }

  // Get initials from username for avatar
  const getInitials = (username) => {
    if (!username) return 'U'
    return username.substring(0, 2).toUpperCase()
  }

  // Check if route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <Button
        type="button"
        className="mt-3 ms-4 md:hidden !bg-[var(--CL-primary)]"
        size="xs"
        color="dark"
        onClick={openSideBar}
      >
        <span className="sr-only">Open sidebar</span>
        {open ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
      </Button>

      <div className={`${open ? 'bg-black/50 inset-0 w-full fixed z-[100] md:w-60' : ''}`} onClick={closeSideBar}>
        <aside
          className={`fixed h-screen transition-all duration-300 inset-0 z-[100] bg-[var(--CL-primary)] shadow-lg md:translate-x-0 
            ${open ? 'translate-x-0' : '-translate-x-60'} 
            ${isCollapsed ? 'w-[4.25rem]' : 'w-60'}`}
        >
          <nav className="flex flex-col h-full px-3 py-5 overflow-y-auto">
            <div className="flex items-center h-12 sm:h-14">
              <a href="/" className="flex items-center gap-0">
                {!isCollapsed && <img src={BrandLogo} alt="Brand logo" className="w-9" />}
                {!isCollapsed && <h2 className="text-2xl text-white whitespace-nowrap">TrámitesEC</h2>}
              </a>
              <button
                onClick={toggleCollapse}
                className="hidden md:block text-white hover:bg-[var(--CL-secondary)] btn btn-ghost  btn-sm !w-max mx-auto  rounded-lg transition"
              >
                <IoChevronBackOutline className={`text-xl transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="mb-0 border-b border-slate-600"></div>

            <ul className="flex flex-col flex-1 gap-1 mt-5 text-sm">
              <li>
                <NavLink
                  to="/"
                  className={`sidebar-item ${isActive("/") ? "active" : ""}`}
                >
                  <IoPerson className="sidebar-icon" />
                  {!isCollapsed && <span>Trámitadores</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/proveedores"
                  className={`sidebar-item ${isActive("/proveedores") ? "active" : ""}`}
                >
                  <IoBusiness className="sidebar-icon" />
                  {!isCollapsed && <span>Proveedores</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/clientes"
                  className={`sidebar-item ${isActive("/clientes") ? "active" : ""}`}
                >
                  <IoPeople className="sidebar-icon" />
                  {!isCollapsed && <span>Clientes</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/tipo-tramites"
                  className={`sidebar-item ${isActive("/tipo-tramites") ? "active" : ""}`}
                >
                  <IoList className="sidebar-icon" />
                  {!isCollapsed && <span>Tipos de Trámites</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/cursos"
                  className={`sidebar-item ${isActive("/cursos") ? "active" : ""}`}
                >
                  <IoSchool className="sidebar-icon" />
                  {!isCollapsed && <span>Cursos</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/agencias"
                  className={`sidebar-item ${isActive("/agencias") ? "active" : ""}`}
                >
                  <IoHome className="sidebar-icon" />
                  {!isCollapsed && <span>Agencias</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/tramites/licencias"
                  className={`sidebar-item ${isActive("/tramites/licencias") ? "active" : ""}`}
                >
                  <FaIdCard className="sidebar-icon" />
                  {!isCollapsed && <span>Licencias</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/tramites/vehiculares"
                  className={`sidebar-item ${isActive("/tramites/vehiculares") ? "active" : ""}`}
                >
                  <FaCar className="sidebar-icon" />
                  {!isCollapsed && <span>Vehículares</span>}
                </NavLink>
              </li>
            </ul>

            {/* User Profile at bottom */}
            <div className="w-full mt-auto">
              <div className="border-t border-slate-700 pt-4 mt-6 mb-1.5"></div>

              <div className={`w-full transition-all duration-300`}>
                <div className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                  <div className="avatar placeholder">
                    <div className="w-8 bg-indigo-600 rounded-full text-neutral-content">
                      <span className="text-xs">{getInitials(activeUser.username)}</span>
                    </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="text-left space-y-0.5">
                      <p className="text-sm font-medium leading-none text-white truncate">
                        {activeUser.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        {isAdmin ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  )}
                </div>
                
                <SidebarLogout isCollapsed={isCollapsed} />
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}

export default Sidebar
