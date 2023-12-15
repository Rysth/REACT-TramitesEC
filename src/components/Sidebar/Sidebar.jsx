import { useState } from 'react'
import { IoClose, IoPerson, IoMenu } from 'react-icons/io5'
import { Button } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import BrandLogo from '../../assets/images/brands/brand.svg'
import SidebarLogout from './components/SidebarLogout'

function Sidebar() {
  const [open, setOpen] = useState()

  const toggleSideBar = () => setOpen(!open)

  return (
    <>
      <Button
        type="button"
        className="float-right mt-3 me-2 sm:hidden"
        size="xs"
        gradientDuoTone={`${open ? 'pinkToOrange' : 'greenToBlue'}`}
        onClick={toggleSideBar}
      >
        <span className="sr-only">Open sidebar</span>
        {open ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
      </Button>

      <aside
        className={`fixed w-64 -translate-x-64 transition inset-0 z-50 bg-white shadow-lg shadow-gray-300 sm:translate-x-0 ${
          open && 'translate-x-0'
        }`}
      >
        <nav className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-">
          <a href="/" className="flex items-center justify-center h-12">
            <img src={BrandLogo} alt="Brand logo" className="w-9 h-9" />
            <h2 className="text-2xl font-semibold whitespace-nowrap sm:text-3xl">TrámitesEC</h2>
          </a>
          <ul className="flex-1 mt-5 text-sm">
            <li>
              <NavLink
                to="/clientes"
                className="flex items-center gap-2 p-2.5 text-gray-900 rounded-lg hover:bg-gray-100group"
              >
                <IoPerson className="text-xl" />
                <span>Clientes</span>
              </NavLink>
            </li>
          </ul>
          <footer>
            <SidebarLogout />
          </footer>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
