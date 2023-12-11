import React from 'react'
import { useSelector } from 'react-redux'

function NavBar() {
  const { activeUser } = useSelector((store) => store.authentication)

  return (
    <header className="flex items-center justify-between py-4 rounded-xl sm:py-6">
      <h2 className="text-lg font-bold sm:text-xl md:text-2xl">{`Hola, ${activeUser.username} 👋`}</h2>
    </header>
  )
}

export default NavBar
