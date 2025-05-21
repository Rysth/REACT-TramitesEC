import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSession } from '../../redux/slices/AuthenticationSlice'
import BrandImage from '../../assets/images/brands/brand_dark.svg'
import BrandImageWhite from '../../assets/images/brands/brand.svg'
import RysthDesignLogo from '../../assets/images/rysthdesign/logo_dark.svg'

function SessionPage() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.authentication)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (userData) => {
    dispatch(createSession(userData))
  }

  return (
    <section className="w-full min-h-full overflow-hidden auth-pattern ">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form side */}
        <div className="relative flex flex-col items-center justify-center p-4 overflow-y-auto sm:p-10 lg:px-36">
          <div className="bg-white max-w-[34rem] w-full p-6 md:p-10 shadow-lg rounded-2xl">
            <header className="mb-6">
              <Link to="/" className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <img src={BrandImage} alt="TramitesEC Logo" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text">
                  TramitesEC
                </h3>
              </Link>

              <h2 className="w-full text-xl md:text-2xl font-bold mb-0.5">
                Inicia sesión en tu cuenta
              </h2>
              <p className="text-neutral-500">¡Bienvenido de vuelta!</p>
            </header>

            <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <label className="flex items-center gap-2 input input-bordered">
                  <i className="opacity-50 bx bx-envelope"></i>
                  <input
                    id="email"
                    type="email"
                    className="grow"
                    placeholder="usuario@dominio.com"
                    {...register('email', {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                </label>
                {errors.email && (
                  <span className="text-xs font-bold text-red-600">
                    {errors.email.message || "Campo requerido"}
                  </span>
                )}
              </fieldset>

              <fieldset className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                </div>
                <label className="flex items-center gap-2 input input-bordered">
                  <i className="opacity-50 bx bx-lock-alt"></i>
                  <input
                    id="password"
                    type="password"
                    className="grow"
                    placeholder="••••••••••••"
                    {...register('password', {
                      required: true,
                    })}
                  />
                </label>
                {errors.password && (
                  <span className="text-xs font-bold text-red-600">
                    {errors.password.message || "Campo requerido"}
                  </span>
                )}
              </fieldset>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <i className="bx bx-log-in"></i>
                  )}
                  <span>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <footer className="fixed left-0 right-0 z-50 text-white transition opacity-70 bottom-3 lg:left-auto lg:top-auto lg:bottom-5 lg:right-5 hover:opacity-100">
            <a
              href="https://rysthdesign.com/"
              className="z-10 flex items-center gap-2 p-2 text-xs transition rounded-md hover:text-indigo-300"
              target="_blank"
              rel="noreferrer"
            >
              Creado Por <img src={RysthDesignLogo} alt="RysthDesign Logo" className="w-12 invert" />
            </a>
          </footer>
        </div>

        {/* Brand side */}
        <div className="relative items-center justify-center hidden w-full h-full lg:flex md:overflow-hidden">
          <div className="p-10 shadow-xl bg-white/10 rounded-3xl backdrop-blur-sm">
            <img
              src={BrandImageWhite}
              alt="Login Illustration"
              className="w-40 selection:bg-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SessionPage
