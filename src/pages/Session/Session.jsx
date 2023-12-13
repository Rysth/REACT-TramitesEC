import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Input, Button } from '@material-tailwind/react'
import { MdKey } from 'react-icons/md'
import { createSession } from '../../redux/slices/AuthenticationSlice'

function Session() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()

  const onSubmit = (userData) => dispatch(createSession(userData))

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
            <fieldset className="mb-4 w-72">
              <Input color="indigo" variant="standard" label="Correo Electrónico" {...register('email')} required />
            </fieldset>
            <fieldset className="mb-4 w-72">
              <Input
                type="password"
                variant="standard"
                color="indigo"
                label="Contraseña"
                {...register('password')}
                required
              />
            </fieldset>
            <fieldset className="mt-4 w-72">
              <Button
                variant="gradient"
                className="flex items-center justify-center gap-1 rounded-full"
                type="submit"
                color="blue"
                fullWidth
              >
                Ingresar
                <MdKey className="text-xl" />
              </Button>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Session
