import { Spinner } from 'flowbite-react'

function Loading() {
  return (
    <header className="grid justify-center text-xl text-center min-h-[35rem] place-items-center sm:text-2xl ">
      <Spinner aria-label="Default status example" className="w-20 h-20 fill-[var(--CL-primary)]" />
    </header>
  )
}

export default Loading
