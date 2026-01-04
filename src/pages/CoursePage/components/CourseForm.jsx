import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HiMiniDocumentText } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { createCourse, updateCourse } from '../../../redux/slices/CourseSlice'

function CourseForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { courseSelected } = useSelector((store) => store.course)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { active: true },
  })

  const onSubmit = (courseData) => {
    courseData.active = Boolean(courseData.active)

    if (courseSelected) {
      const isDifferent = ['name', 'active'].some((key) => courseData[key] !== courseSelected[key])

      if (isDifferent) {
        dispatch(updateCourse({ activeToken, courseData: { ...courseData, id: courseSelected.id } }))
          .then(() => refetchFunction())
          .then(() => closeModal())
      } else {
        closeModal()
      }
    } else {
      dispatch(createCourse({ activeToken, courseData }))
        .then(() => {
          refetchFunction()
          reset({ name: '', active: true })
        })
        .then(() => closeModal())
    }
  }

  useEffect(() => {
    if (courseSelected) {
      Object.keys(courseSelected).forEach((key) => {
        setValue(key, courseSelected[key])
      })
    } else {
      reset({ name: '', active: true })
    }
  }, [courseSelected, reset, setValue])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="name" className="label-text">
              Nombre
            </label>
            {errors.name && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2 input input-bordered">
            <HiMiniDocumentText className="w-4 h-4 opacity-70" />
            <input
              id="name"
              type="text"
              placeholder=""
              {...register('name', { required: true })}
              className="grow"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="active" className="label-text">
              Activo
            </label>
            {errors.active && <span className="badge-sm badge badge-error">Campo Requerido</span>}
          </div>
          <label className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              className="toggle toggle-success"
              {...register('active')}
              checked={watch('active')}
              onChange={(e) => setValue('active', e.target.checked)}
            />
            <span className="text-sm">Disponible para asignar</span>
          </label>
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
  )
}

CourseForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CourseForm
