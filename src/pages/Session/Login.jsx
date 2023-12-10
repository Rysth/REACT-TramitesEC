import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createSession } from '../../redux/slices/AuthenticationSlice'

function Login() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()

  const onSubmit = (userData) => {
    dispatch(createSession(userData))
  }

  return (
    <section className="w-full h-screen">
      <div className="flex flex-col sm:grid sm:grid-cols-[60%_1fr] h-full ">
        <header className="h-full bg-gradient-to-b from-[var(--CL-blue-light)] to-[var(--CL-blue-darker)] flex flex-col items-center justify-center text-white gap-1 max-h-40 sm:max-h-full">
          <h2 className="text-4xl font-bold md:text-6xl">¡Bienvenido!</h2>
          <p className="">Sistema de Trámites</p>
        </header>
        <div className="flex flex-col items-center justify-center h-full ">
          <form
            className="flex flex-col items-center justify-center h-full gap-1 w-72 sm:rounded-l-3xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="w-full mb-5 text-3xl font-bold text-left md:text-4xl">Iniciar Sesión</h2>
            <label htmlFor="email" className="grid w-full gap-2 text-sm">
              <span className="font-semibold">Correo Electrónico:</span>
              <input
                type="email"
                required
                {...register('email')}
                className="p-3 px-5 border border-gray-200 rounded-full"
                placeholder="username@example.com"
              />
            </label>
            <label htmlFor="email" className="grid w-full gap-2 mt-5 text-sm">
              <span className="font-semibold">Contraseña:</span>
              <input
                type="password"
                required
                {...register('password')}
                className="p-3 px-5 border border-gray-200 rounded-full"
                placeholder="*********"
              />
            </label>
            <button
              type="submit"
              className="w-full p-3 mt-5 text-sm text-white rounded-full bg-blue-light md:hover:scale-105 md:hover:shadow-lg md:transition md:active:scale-95"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login
