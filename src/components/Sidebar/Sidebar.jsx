import { Button } from 'flowbite-react'
import { useState } from 'react'
import { IoClose, IoMenu, IoPeople, IoPerson, IoDocument } from 'react-icons/io5'
import { MdAccountCircle, MdSpaceDashboard } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'

function Sidebar() {
  const [open, setOpen] = useState()
  const { id, username } = useSelector((store) => store.authentication.activeUser)

  const openSideBar = () => setOpen(true)
  const closeSideBar = () => setOpen(false)

  return (
    <>
      <Button type="button" className="mt-3 ms-4 md:hidden" size="xs" color="dark" onClick={openSideBar}>
        <span className="sr-only">Open sidebar</span>
        {open ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
      </Button>

      <div className={`${open && 'bg-black/50 inset-0 w-full fixed z-[1000] md:w-64'}`} onClick={closeSideBar}>
        <aside
          className={`fixed w-64 -translate-x-64 h-screen transition inset-0 z-[9000] bg-[var(--CL-primary)] shadow-lg  md:translate-x-0  ${
            open && 'translate-x-0'
          }`}
        >
          <nav className="flex flex-col h-full p-4 overflow-y-auto">
            <a href="/" className="flex items-center justify-center h-12 sm:h-16">
              <img src={BrandLogo} alt="Brand logo" className="w-9 h-9" />
              <h2 className="text-2xl text-white whitespace-nowrap sm:text-3xl">TrámitesEC</h2>
            </a>
            <ul className="flex flex-col flex-1 gap-1 mt-5 text-sm">
              <li>
                <NavLink
                  to="/"
                  className="flex items-center gap-2 p-2.5 text-[#becaef] rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <MdSpaceDashboard className="text-xl" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tramitadores"
                  className="flex items-center gap-2 p-2.5 text-[#becaef] rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoPerson className="text-xl" />
                  <span>Trámitadores</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="flex items-center gap-2 p-2.5 text-[#becaef] rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoPeople className="text-xl" />
                  <span>Clientes</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tramites"
                  className="flex items-center gap-2 p-2.5 text-[#becaef] rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <IoDocument className="text-xl" />
                  <span>Trámites</span>
                </NavLink>
              </li>
              <li className="mt-3 mb-3">
                <hr />
              </li>
              <li>
                <NavLink
                  to={`/profiles/${id}`}
                  className="flex items-center gap-2 p-2.5 text-[#becaef] rounded-md hover:bg-[var(--CL-secondary)] transition"
                >
                  <MdAccountCircle className="text-xl" />
                  <span>{username}</span>
                </NavLink>
              </li>
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
