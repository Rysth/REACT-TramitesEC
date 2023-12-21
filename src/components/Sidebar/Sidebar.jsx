import { useState } from 'react'
import { IoClose, IoPerson, IoMenu, IoPeople } from 'react-icons/io5'
import { Button } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'

function Sidebar() {
  const [open, setOpen] = useState()

  const openSideBar = () => setOpen(true)
  const closeSideBar = () => setOpen(false)

  return (
    <>
      <Button
        type="button"
        className="mt-3 ms-4 sm:hidden"
        size="xs"
        gradientDuoTone="greenToBlue"
        onClick={openSideBar}
      >
        <span className="sr-only">Open sidebar</span>
        {open ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
      </Button>

      <div className={`${open && 'bg-black/50 inset-0 w-full fixed z-[1000] sm:w-64'}`} onClick={closeSideBar}>
        <aside
          className={`fixed w-64 -translate-x-64 transition inset-0 z-[9000] bg-white shadow-lg  sm:translate-x-0  ${
            open && 'translate-x-0'
          }`}
        >
          <nav className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-">
            <a href="/" className="flex items-center justify-center h-12 sm:h-16">
              <img src={BrandLogo} alt="Brand logo" className="w-9 h-9" />
              <h2 className="text-2xl whitespace-nowrap sm:text-3xl">TrámitesEC</h2>
            </a>
            <ul className="flex flex-col flex-1 mt-5 text-sm font-semibold">
              <li>
                <NavLink
                  to="/"
                  className="flex items-center gap-2 p-2.5 text-[#A1A0BD] rounded-lg hover:scale-105 transition"
                >
                  <IoPerson className="text-xl" />
                  <span>Trámitadores</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="flex items-center gap-2 p-2.5 text-[#A1A0BD] rounded-lg hover:scale-105 transition"
                >
                  <IoPeople className="text-xl" />
                  <span>Clientes</span>
                </NavLink>
              </li>
            </ul>
            <footer>
              <SidebarLogout />
            </footer>
          </nav>
        </aside>
      </div>
    </>
  )
}

export default Sidebar
