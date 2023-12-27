import SessionSignIn from './components/SessionSignIn'

function SessionPage() {
  return (
    <section className="w-full h-screen">
      <div className="flex flex-col h-full sm:grid sm:grid-cols-2 lg:grid-cols-[60%_1fr] ">
        <header className="h-full bg-[var(--CL-primary)] flex flex-col items-center justify-center text-white gap-1 max-h-40 sm:max-h-full">
          <h2 className="text-4xl font-bold md:text-6xl lg:text-8xl">¡Bienvenido!</h2>
          <p className="sm:text-2xl">Sistema de Trámites</p>
        </header>
        <div className="flex flex-col items-center justify-center h-full bg-white">
          <SessionSignIn />
        </div>
      </div>
    </section>
  )
}

export default SessionPage
