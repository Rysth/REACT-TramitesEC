import { Spinner } from 'flowbite-react'

function Loading() {
  return (
    <header className="flex flex-col items-center justify-center h-full text-xl text-center sm:text-2xl ">
      <Spinner
        aria-label="Default status example"
        color="purple"
        className="w-20 h-20 fill-[var(--CL-primary-indigo)]"
      />
    </header>
  )
}

export default Loading
