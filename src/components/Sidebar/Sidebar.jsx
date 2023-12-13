import { useState } from 'react'
import { Card, Typography, List, ListItem, Button } from '@material-tailwind/react'
import { HiMiniUserGroup, HiDocumentText } from 'react-icons/hi2'
import { NavLink } from 'react-router-dom'
import BrandImage from '../../assets/images/brands/brand.svg'

export function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleSidebar = () => setShowSidebar(!showSidebar)

  return (
    <>
      <Button onClick={toggleSidebar} className="mt-2 sm:hidden sm:ml-64 ms-2" color="indigo">
        Toggle
      </Button>
      <aside className={`w-0 ${showSidebar && 'fixed bg-black/50 transition w-full sm:w-64 left-0 right-0 top-0'}`}>
        <div
          className={`w-full h-screen sm:block sm:relative ${
            showSidebar && 'fixed bg-black/50 transition w-full left-0 right-0 top-0'
          }`}
          onClick={toggleSidebar}
        >
          <Card
            className={`fixed top-0 sm:left-0 w-64 -translate-x-64 sm:translate-x-0 h-screen p-4 rounded-none shadow-xl bg-white shadow-black/15 ${
              showSidebar && 'translate-x-0 transition'
            }`}
          >
            <div className="flex items-center px-4 py-1 pointer-events-none">
              <img src={BrandImage} alt="" className="w-12 h-12" />
              <Typography variant="h4" color="black">
                TrámitesEC
              </Typography>
            </div>
            <List className="p-0">
              <hr className="my-2" />
              <NavLink to="/" className="!rounded-r-none">
                <ListItem className="flex items-center gap-2 text-sm !rounded-r-none focus:bg-opacity-0 focus:text-white">
                  <HiMiniUserGroup className="text-xl" />
                  Clientes
                </ListItem>
              </NavLink>
              <NavLink to="/tramites" className="!rounded-r-none">
                <ListItem className="flex items-center gap-2 text-sm !rounded-r-none focus:bg-opacity-0 focus:text-white">
                  <HiDocumentText className="text-xl" />
                  Trámites
                </ListItem>
              </NavLink>
            </List>
          </Card>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
