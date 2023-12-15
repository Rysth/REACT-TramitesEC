import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { MdKey } from 'react-icons/md'
import { Input, Button } from '@material-tailwind/react'
import { createSession } from '../../../redux/slices/AuthenticationSlice'

function SessionSignIn() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()

  const onSubmit = (userData) => dispatch(createSession(userData))

  return (
    <form
      className="flex flex-col items-center justify-center h-full gap-5 w-72 sm:rounded-l-3xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="w-full mb-5 text-3xl font-bold text-center md:text-4xl">Iniciar Sesión</h2>
      <Input color="indigo" variant="standard" label="Correo Electrónico" {...register('email')} required />
      <Input type="password" variant="standard" color="indigo" label="Contraseña" {...register('password')} required />
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
    </form>
  )
}

export default SessionSignIn
