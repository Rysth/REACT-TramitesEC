import React from 'react'
import SectionLayout from '../../layouts/SectionLayout'
import { useSelector } from 'react-redux'
import { HiUserCircle } from 'react-icons/hi2'

function UserProfile() {
  const { username } = useSelector((store) => store.authentication.activeUser)

  return (
    <SectionLayout>
      <header className="bg-[var(--CL-primary)] rounded-xl h-60 flex flex-col sm:flex-row items-center justify-center p-4 shadow-xl  text-white">
        <HiUserCircle className="text-8xl" />
        <h2 className="text-2xl sm:text-4xl ">{username}</h2>
      </header>
    </SectionLayout>
  )
}

export default UserProfile
