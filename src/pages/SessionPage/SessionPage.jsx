import { Button, Label, TextInput } from 'flowbite-react'
import { useForm } from 'react-hook-form'
import { HiMail } from 'react-icons/hi'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import UndrawLogin from '../../assets/images/illustrations/undraw_login.svg'
import { createSession } from '../../redux/slices/AuthenticationSlice'

function SessionPage() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()

  const onSubmit = (userData) => {
    dispatch(createSession(userData))
  }

  return (
    <section className="w-full min-h-screen bg-dashboard-background">
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="relative flex flex-col items-center justify-center p-8 bg-white shadow-md sm:p-10 lg:px-36 lg:p-20 shadow-black/10 min-w-80 lg:min-w-96">
          <form className="flex flex-col w-full gap-1.5" onSubmit={handleSubmit(onSubmit)}>
            <header className="mb-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src={UndrawLogin} alt="TramitesEC Logo" className="w-10" />
                <h3 className="font-medium text-blue-500">TramitesEC</h3>
              </div>
              <h2 className="w-full mb-0.5 text-3xl font-bold">Inicia sesión con tu cuenta.</h2>
              <p className="text-neutral-500">¡Bienvenido nuevamente!</p>
            </header>
            <fieldset className="w-full">
              <div className="w-full form-control">
                <div className="label">
                  <Label htmlFor="email" value="Correo Electrónico" className="label-text" />
                </div>
                <label className="flex items-center gap-2 input input-bordered">
                  <HiMail className="opacity-50" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="usuario@dominio.com"
                    {...register('email')}
                    className="grow"
                    required
                  />
                </label>
              </div>
            </fieldset>
            <fieldset className="w-full">
              <div className="w-full form-control">
                <div className="label">
                  <Label htmlFor="password" value="Contraseña" className="label-text" />
                </div>
                <label className="flex items-center gap-2 input input-bordered">
                  <RiLockPasswordFill className="opacity-50" />
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register('password')}
                    className="grow"
                    required
                  />
                </label>
              </div>
            </fieldset>
            <div className="mt-6 actions">
              <Button type="submit" className="w-full btn btn-primary">
                <span>Iniciar Sesión</span>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-1 mt-4 text-sm text-center">
              <p className="text-neutral-500">¿No tienes una cuenta?</p>
              <a href="/register" className="link link-secondary w-max text-secondary">
                Crear una cuenta
              </a>
            </div>
          </form>
          <footer className="fixed text-white transition opacity-50 top-3 right-3 lg:top-auto lg:bottom-5 lg:right-5 hover:opacity-100">
            <a
              href="https://rysthdesign.com/"
              className="flex items-center gap-2 p-2 mt-2 text-xs transition rounded-md hover:scale-105"
              target="_blank"
              rel="noreferrer"
            >
              Creado Por <img src="/src/assets/images/brands/brand.svg" alt="RysthDesign Logo" className="w-12" />
            </a>
          </footer>
        </div>
        <div className="flex items-center justify-center order-first w-full h-full bg-gradient-to-r lg:order-last from-indigo-500 to-blue-500">
          <div className="flex items-center gap-2 py-2">
            <img src={UndrawLogin} alt="Login Illustration" className="w-20 md:w-40" />
            <h3 className="font-medium text-blue-500 sr-only">TramitesEC Template</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SessionPage
