import { Button } from 'flowbite-react'
import { useState } from 'react'
import { IoChevronDown, IoChevronUp, IoClose, IoDocument, IoMenu, IoPeople, IoPerson } from 'react-icons/io5'
import { MdAccountCircle } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'
import { FaChevronRight } from 'react-icons/fa'

function Sidebar() {
  const [open, setOpen] = useState()
  const [showSubMenu, setShowSubMenu] = useState(false)
  const { id, username, is_admin } = useSelector((store) => store.authentication.activeUser)

  const openSideBar = () => setOpen(true)
  const closeSideBar = () => setOpen(false)

  const isAdmin = is_admin

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

      <div className={`${open && 'bg-black/50 inset-0 w-full fixed z-[1000] md:w-60'}`} onClick={closeSideBar}>
        <aside
          className={`fixed w-60 -translate-x-60 h-screen transition inset-0 z-[9000] bg-[var(--CL-primary)] shadow-lg  md:translate-x-0  ${
            open && 'translate-x-0'
          }`}
        >
          <nav className="flex flex-col h-full px-3 py-5 overflow-y-auto">
            <a href="/" className="flex items-center justify-center h-12 sm:h-16">
              <img src={BrandLogo} alt="Brand logo" className="w-9 h-9" />
              <h2 className="text-2xl text-white whitespace-nowrap">TrámitesEC</h2>
            </a>
            <ul className="flex flex-col flex-1 gap-1 mt-5 text-sm">
              <li>
                <NavLink
                  to="/"
                  className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoPerson className="text-xl" />
                  <span>Trámitadores</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoPeople className="text-xl" />
                  <span>Clientes</span>
                </NavLink>
              </li>
              <li>
                <button
                  to="/tramites"
                  className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition w-full"
                  onClick={() => setShowSubMenu(!showSubMenu)}
                >
                  <IoDocument className="text-xl" />
                  <span>Trámites</span>
                  {showSubMenu ? (
                    <IoChevronUp className="ml-auto text-xl" />
                  ) : (
                    <IoChevronDown className="ml-auto text-xl" />
                  )}
                </button>
                <ul className={`pl-4 mt-1 grid gap-1 ${!showSubMenu && 'hidden'}`}>
                  <li>
                    <NavLink
                      to="/tramites/licencias"
                      className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition w-full"
                    >
                      <FaChevronRight className="text-xl" />
                      Licencias
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tramites/vehiculares"
                      className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition w-full"
                    >
                      <FaChevronRight className="text-xl" />
                      Vehículares
                    </NavLink>
                  </li>
                </ul>
              </li>

              {isAdmin && (
                <>
                  {' '}
                  <li className="mt-3 mb-3">
                    <hr />
                  </li>
                  <li>
                    <NavLink
                      to={`/profiles/${id}`}
                      className="flex items-center gap-2 p-2.5 text-slate-300 hover:!text-white rounded-md hover:bg-[var(--CL-secondary)] transition"
                    >
                      <MdAccountCircle className="text-xl" />
                      <span>{username}</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <footer className="grid gap-2">
              <SidebarLogout />
            </footer>
          </nav>
        </aside>
      </div>
    </>
  )
}

export default Sidebar
