import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { HiMail } from 'react-icons/hi'
import { Button, TextInput, Label } from 'flowbite-react'
import { RiLockPasswordFill } from 'react-icons/ri'
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
      <h2 className="w-full mb-3 text-3xl font-bold text-center md:text-4xl">Iniciar Sesión</h2>
      <fieldset className="w-full">
        <Label htmlFor="email" value="Correo Electrónico" className="block mb-2" />
        <TextInput icon={HiMail} placeholder="username@example.com" {...register('email')} required />
      </fieldset>
      <fieldset className="w-full">
        <Label htmlFor="email1" className="block mb-2" value="Your email" />
        <TextInput icon={RiLockPasswordFill} type="password" placeholder="******" {...register('password')} required />
      </fieldset>
      <Button className="flex items-center justify-center w-full gap-2 rounded-full" type="submit" color="blue">
        <span>Ingresar</span>
      </Button>
    </form>
  )
}

export default SessionSignIn
