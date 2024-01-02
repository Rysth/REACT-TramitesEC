import { Spinner } from 'flowbite-react'

function Loading() {
  return (
    <header className="flex flex-col items-center justify-center text-xl text-center h-96 sm:text-2xl ">
      <Spinner
        aria-label="Default status example"
        color="purple"
        className="w-20 h-20 fill-[var(--CL-primary-indigo)]"
      />
    </header>
  )
}

export default Loading
