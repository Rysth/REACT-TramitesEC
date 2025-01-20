import { Button } from 'flowbite-react'
import { useState } from 'react'
import { FaChevronRight, FaCar, FaIdCard } from 'react-icons/fa' // Add these icons
import {
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoDocument,
  IoMenu,
  IoPeople,
  IoPerson,
  IoBusiness,
  IoList,
  IoChevronBackOutline,
} from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'
import { useDispatch, useSelector } from 'react-redux'
import { sharedActions } from '../../redux/slices/SharedSlice'

function Sidebar() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false) // Initialize as false
  const [showSubMenu, setShowSubMenu] = useState(false)
  const isCollapsed = useSelector((state) => state.shared.isSidebarCollapsed)

  const openSideBar = () => setOpen(true)
  const closeSideBar = () => setOpen(false)
  const toggleCollapse = () => {
    dispatch(sharedActions.toggleSidebar())
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

      <div className={`${open && 'bg-black/50 inset-0 w-full fixed z-[100] md:w-60'}`} onClick={closeSideBar}>
        <aside
          className={`fixed h-screen transition-all duration-300 inset-0 z-[100] bg-[var(--CL-primary)] shadow-lg md:translate-x-0 
            ${open ? 'translate-x-0' : '-translate-x-60'} 
            ${isCollapsed ? 'w-20' : 'w-60'}`}
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

            <ul className="flex flex-col flex-1 gap-1 mt-5 text-sm">
              <li>
                <NavLink
                  to="/"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition w-full"
                >
                  <IoPerson className="text-xl" />
                  {!isCollapsed && <span>Trámitadores</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/proveedores"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start w-full text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoBusiness className="text-xl" />
                  {!isCollapsed && <span>Proveedores</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start w-full text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoPeople className="text-xl" />
                  {!isCollapsed && <span>Clientes</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tramites/licencias"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start w-full text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition"
                >
                  <FaIdCard className="text-xl" />
                  {!isCollapsed && 'Licencias'}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tramites/vehiculares"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start w-full text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition"
                >
                  <FaCar className="text-xl" />
                  {!isCollapsed && 'Vehículares'}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tipo-tramites"
                  className="btn btn-ghost !min-h-0 !h-[2.5rem] justify-start w-full text-slate-400 hover:!text-white hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoList className="text-xl" />
                  {!isCollapsed && <span>Tipos de Trámites</span>}
                </NavLink>
              </li>
            </ul>
            <footer className="grid gap-2">
              <SidebarLogout isCollapsed={isCollapsed} />
            </footer>
          </nav>
        </aside>
      </div>
    </>
  )
}

export default Sidebar
