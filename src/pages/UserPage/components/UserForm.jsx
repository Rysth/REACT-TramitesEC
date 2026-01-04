import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDocumentText, HiMiniEnvelope, HiMiniKey, HiMiniEye, HiMiniEyeSlash } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createUser, updateUser, updateUserPassword } from '../../../redux/slices/UserSlice'

function UserForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((store) => store.authentication)
  const { userSelected } = useSelector((store) => store.users)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordData, setPasswordData] = useState({ password: '', passwordConfirmation: '' })
  const [passwordError, setPasswordError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { active: true, is_admin: false },
  })

  const onSubmit = (userData) => {
    userData.active = Boolean(userData.active)
    userData.is_admin = Boolean(userData.is_admin)

    if (userSelected) {
      const isDifferent = ['username', 'email', 'active', 'is_admin'].some(
        (key) => userData[key] !== userSelected[key]
      )

      if (isDifferent) {
        dispatch(updateUser({ activeToken, userData: { ...userData, id: userSelected.id } }))
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        closeModal()
      }
    } else {
      // For new users, password is required
      if (!userData.password || userData.password.length < 6) {
        return
      }
      dispatch(createUser({ activeToken, userData }))
        .then(() => {
          refetchFunction()
          reset({ username: '', email: '', password: '', active: true, is_admin: false })
        })
        .then(() => closeModal())
    }
  }

  const handlePasswordUpdate = () => {
    setPasswordError('')

    if (!passwordData.password || passwordData.password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.password !== passwordData.passwordConfirmation) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    dispatch(
      updateUserPassword({
        activeToken,
        userID: userSelected.id,
        password: passwordData.password,
        passwordConfirmation: passwordData.passwordConfirmation,
      })
    ).then(() => {
      setPasswordData({ password: '', passwordConfirmation: '' })
      setShowPasswordSection(false)
    })
  }

  useEffect(() => {
    if (userSelected) {
      Object.keys(userSelected).forEach((key) => {
        setValue(key, userSelected[key])
      })
      setShowPasswordSection(false)
      setPasswordData({ password: '', passwordConfirmation: '' })
    } else {
      reset({ username: '', email: '', password: '', active: true, is_admin: false })
    }
  }, [userSelected, reset, setValue])

  const isCurrentUser = userSelected?.id === activeUser?.id

  return (
    <div className="space-y-6">
      <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="username" className="label-text">
                Nombre de Usuario
              </label>
              {errors.username && <span className="badge-sm badge badge-error">Campo Requerido</span>}
            </div>
            <label className="flex items-center gap-2 input input-bordered">
              <HiMiniDocumentText className="w-4 h-4 opacity-70" />
              <input
                id="username"
                type="text"
                placeholder="Nombre completo"
                {...register('username', { required: true })}
                className="grow"
              />
            </label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="label-text">
                Correo Electrónico
              </label>
              {errors.email && (
                <span className="badge-sm badge badge-error">
                  {errors.email.type === 'pattern' ? 'Email inválido' : 'Campo Requerido'}
                </span>
              )}
            </div>
            <label className="flex items-center gap-2 input input-bordered">
              <HiMiniEnvelope className="w-4 h-4 opacity-70" />
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="grow"
              />
            </label>
          </div>
        </fieldset>

        {/* Password field only for new users */}
        {!userSelected && (
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label-text">
                  Contraseña
                </label>
                {errors.password && (
                  <span className="badge-sm badge badge-error">
                    {errors.password.type === 'minLength' ? 'Mínimo 6 caracteres' : 'Campo Requerido'}
                  </span>
                )}
              </div>
              <label className="flex items-center gap-2 input input-bordered">
                <HiMiniKey className="w-4 h-4 opacity-70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: true, minLength: 6 })}
                  className="grow"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="opacity-70">
                  {showPassword ? <HiMiniEyeSlash className="w-4 h-4" /> : <HiMiniEye className="w-4 h-4" />}
                </button>
              </label>
            </div>
          </fieldset>
        )}

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="is_admin" className="label-text">
                Administrador
              </label>
            </div>
            <label className="flex items-center gap-2">
              <input
                id="is_admin"
                type="checkbox"
                className="toggle toggle-primary"
                {...register('is_admin')}
                checked={watch('is_admin')}
                onChange={(e) => setValue('is_admin', e.target.checked)}
                disabled={isCurrentUser}
              />
              <span className="text-sm">Permisos de administrador</span>
            </label>
            {isCurrentUser && (
              <p className="text-xs text-gray-500">No puedes modificar tu propio rol</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="active" className="label-text">
                Activo
              </label>
            </div>
            <label className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                className="toggle toggle-success"
                {...register('active')}
                checked={watch('active')}
                onChange={(e) => setValue('active', e.target.checked)}
                disabled={isCurrentUser}
              />
              <span className="text-sm">Usuario activo</span>
            </label>
            {isCurrentUser && (
              <p className="text-xs text-gray-500">No puedes desactivar tu propia cuenta</p>
            )}
          </div>
        </fieldset>

        <fieldset className="flex items-center justify-end gap-2 p-4 px-0 pt-0">
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button type="button" className="btn btn-error" onClick={closeModal}>
            Cancelar
          </button>
        </fieldset>
      </form>

      {/* Password change section for existing users */}
      {userSelected && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Cambiar Contraseña</h3>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? 'Cancelar' : 'Cambiar Contraseña'}
            </button>
          </div>

          {showPasswordSection && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {passwordError && (
                <div className="alert alert-error">
                  <span>{passwordError}</span>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="new_password" className="label-text">
                    Nueva Contraseña
                  </label>
                  <label className="flex items-center gap-2 input input-bordered">
                    <HiMiniKey className="w-4 h-4 opacity-70" />
                    <input
                      id="new_password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                      className="grow"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="opacity-70">
                      {showPassword ? <HiMiniEyeSlash className="w-4 h-4" /> : <HiMiniEye className="w-4 h-4" />}
                    </button>
                  </label>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="label-text">
                    Confirmar Contraseña
                  </label>
                  <label className="flex items-center gap-2 input input-bordered">
                    <HiMiniKey className="w-4 h-4 opacity-70" />
                    <input
                      id="confirm_password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordData.passwordConfirmation}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, passwordConfirmation: e.target.value })
                      }
                      className="grow"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="btn btn-primary" onClick={handlePasswordUpdate}>
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

UserForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default UserForm
