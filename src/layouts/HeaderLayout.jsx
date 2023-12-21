import React from 'react'
import { useSelector } from 'react-redux'

function HeaderLayout() {
  const { username } = useSelector((store) => store.authentication.activeUser)
  return (
    <header>
      <h2 className="text-xl sm:text-2xl">{`Hola, ${username} 👋`}</h2>
    </header>
  )
}

export default HeaderLayout
