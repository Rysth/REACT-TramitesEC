import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { Button, Label, Select, TextInput } from 'flowbite-react'
import { HiIdentification, HiMiniEnvelope, HiMiniUserCircle, HiMiniDevicePhoneMobile, HiMapPin } from 'react-icons/hi2'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'

function CustomerForm({ closeModal }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { processorOriginal } = useSelector((store) => store.processor)
  const { customersOriginal } = useSelector((store) => store.customer)
  const { typesOriginal } = useSelector((store) => store.type)
  const { licensesOriginal } = useSelector((store) => store.license)
  const { procedureSelected } = useSelector((store) => store.procedure)
  const { register, handleSubmit, reset } = useForm()

  const handleCreateOrUpdate = (newProcedure) => {
    const procedureData = {
      ...newProcedure,
    }

    if (procedureSelected) {
      const oldCustomer = {
        id: procedureSelected.id,
        ...procedureData,
      }
      dispatch(updateProcedure({ activeToken, oldCustomer })).then(() => closeModal())
      return
    }

    dispatch(createProcedure({ activeToken, newProcedure: procedureData })).then(() => closeModal())
  }

  const onSubmit = (procedureData) => {
    handleCreateOrUpdate(procedureData)
  }

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="type_id" value="Tipo Trámite" />
          <Select
            id="type_id"
            {...register('type_id')}
            defaultValue={procedureSelected && procedureSelected.type.id}
            required
          >
            {typesOriginal.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="license_id" value="Licencia" />
          <Select
            id="license_id"
            {...register('license_id')}
            defaultValue={procedureSelected && procedureSelected.license.id}
            required
          >
            {licensesOriginal.map((license) => (
              <option key={license.id} value={license.id}>
                {license.nombre}
              </option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="processor_id" value="Trámitador" />
          <Select
            id="processor_id"
            {...register('processor_id')}
            defaultValue={procedureSelected && procedureSelected.processor.id}
            required
          >
            {processorOriginal.map((processor) => (
              <option
                key={processor.id}
                value={processor.id}
              >{`${processor.cedula}: ${processor.nombres} ${processor.apellidos}`}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="customer_id" value="Cliente" />
          <Select
            id="customer_id"
            {...register('customer_id')}
            defaultValue={procedureSelected && procedureSelected.customer.id}
            required
          >
            {customersOriginal.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >{`${customer.cedula}: ${customer.nombres} ${customer.apellidos}`}</option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="placa" value="Placa" />
          <TextInput
            id="placa"
            placeholder="GJS-2050"
            defaultValue={procedureSelected && procedureSelected.placa}
            icon={HiIdentification}
            {...register('placa')}
            required
          />
        </div>
        <div>
          <Label htmlFor="valor" value="Valor" />
          <TextInput
            id="valor"
            placeholder="200"
            defaultValue={procedureSelected && procedureSelected.valor}
            icon={HiMiniUserCircle}
            {...register('valor')}
            required
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="valor_pendiente" value="Valor Pendiente" />
          <TextInput
            id="valor_pendiente"
            placeholder="100"
            defaultValue={procedureSelected && procedureSelected.valor_pendiente}
            icon={HiMiniUserCircle}
            {...register('valor_pendiente')}
            required
          />
        </div>
        <div>
          <Label htmlFor="ganancia" value="Ganancia" />
          <TextInput
            id="ganancia"
            placeholder="50"
            defaultValue={procedureSelected && procedureSelected.ganancia}
            icon={HiMiniDevicePhoneMobile}
            {...register('ganancia')}
            required
          />
        </div>
      </fieldset>
      <fieldset className="grid">
        <div>
          <Label htmlFor="observaciones" value="Observaciones" />
          <TextInput
            id="observaciones"
            placeholder="Lorem Ipsum"
            defaultValue={procedureSelected && procedureSelected.observaciones}
            icon={HiMapPin}
            {...register('observaciones')}
            required
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end gap-2 mt-10">
        <Button color="blue" type="submit" className="mt-3">
          Guardar
        </Button>
        <Button color="failure" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default CustomerForm
