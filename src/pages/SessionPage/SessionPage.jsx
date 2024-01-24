import { Button, Label, TextInput } from 'flowbite-react'
import { useForm } from 'react-hook-form'
import { HiMail } from 'react-icons/hi'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import UndrawLogin from '../../assets/images/illustrations/undraw_login.svg'
import BrandImage from '../../assets/personal/brand_blue.svg'
import { createSession } from '../../redux/slices/AuthenticationSlice'

function SessionPage() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const onSubmit = (userData) => dispatch(createSession(userData))

  return (
    <section className="w-full h-screen">
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-100">
        <div className="flex flex-col items-center justify-center max-w-screen-sm p-4 py-8 bg-white shadow-xl sm:p-10 shadow-black/15 rounded-xl">
          <form
            className="flex flex-col items-center justify-center h-full gap-5 w-72 sm:rounded-l-3xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <img src={UndrawLogin} alt="Login session illustration" className="w-40 sm:w-60" />
            <h2 className="w-full mb-3 text-3xl font-bold text-center">Iniciar Sesión</h2>
            <fieldset className="w-full">
              <Label htmlFor="email" value="Correo Electrónico" className="block mb-2" />
              <TextInput icon={HiMail} placeholder="username@example.com" {...register('email')} required />
            </fieldset>
            <fieldset className="w-full">
              <Label htmlFor="password" className="block mb-2" value="Contraseña" />
              <TextInput
                icon={RiLockPasswordFill}
                type="password"
                placeholder="*****"
                {...register('password')}
                required
              />
            </fieldset>
            <Button
              className="flex items-center justify-center w-full gap-2 transition rounded-lg bg-blue-dark durantion 300"
              type="submit"
              color="dark"
            >
              <span>Ingresar</span>
            </Button>
          </form>
        </div>
        <footer className="text-center">
          <a
            href="https://rysthdesign.netlify.app/"
            className="flex items-center gap-2 p-2 text-xs transition rounded-md bottom-5 right-6 hover:scale-105"
            target="_blank"
            rel="noreferrer"
          >
            Creado Por <img src={BrandImage} alt="RysthDesign Logo" className="w-12" />
          </a>
        </footer>
      </div>
    </section>
  )
}

export default SessionPage
