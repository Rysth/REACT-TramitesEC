import { Button, TextInput } from '@tremor/react'
import { Badge, Label, Select } from 'flowbite-react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  HiChatBubbleBottomCenterText,
  HiCurrencyDollar,
  HiDocument,
  HiIdentification,
  HiListBullet,
} from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { createProcedure, updateProcedure } from '../../../redux/slices/ProcedureSlice'
import { fetchProcessorOptions } from '../../../redux/slices/ProcessorSlice'
import { fetchCustomerOptions } from '../../../redux/slices/CustomerSlice'

function CustomerForm({ closeModal, refetchFunction }) {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)
  const { typesOriginal, licensesArray, statusOriginal } = useSelector((store) => store.shared)
  const { procedureSelected } = useSelector((store) => store.procedure)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (procedureData) => {
    if (procedureSelected) {
      dispatch(updateProcedure({ activeToken, procedureData: { ...procedureData, id: procedureSelected.id } }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    } else {
      dispatch(createProcedure({ activeToken, procedureData }))
        .then(() => refetchFunction())
        .then(() => closeModal())
    }
  }

  // Load processor options
  const loadProcessorOptions = debounce((inputValue, callback) => {
    dispatch(fetchProcessorOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((processor) => ({
          label: `${processor.codigo} - ${processor.nombres} ${processor.apellidos}`,
          value: processor.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 800)

  // Load customer options
  const loadCustomerOptions = debounce((inputValue, callback) => {
    dispatch(fetchCustomerOptions({ activeToken, query: inputValue.toLowerCase() }))
      .unwrap()
      .then((response) => {
        const options = response.map((customer) => ({
          label: `${customer.cedula} - ${customer.nombres} ${customer.apellidos}`,
          value: customer.id,
        }))
        callback(options)
      })
      .catch(() => callback([]))
  }, 800)

  useEffect(() => {
    if (procedureSelected) {
      Object.keys(procedureSelected).forEach((key) => {
        setValue(key, procedureSelected[key])
      })
    } else {
      reset() // Reset the form if no procedure is selected
    }
  }, [procedureSelected, reset, setValue])

  const isProcedureFinished = procedureSelected && procedureSelected.status.id === 3 ? true : false

  return (
    <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="type_id" value="Tipo Trámite" />
            {errors.type_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <Select
            icon={HiDocument}
            id="type_id"
            {...register('type_id')}
            defaultValue={procedureSelected && procedureSelected.type.id}
            disabled={isProcedureFinished}
            required
          >
            {typesOriginal.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="license_id" value="Licencia" />
            {errors.license_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <Select
            icon={HiIdentification}
            id="license_id"
            {...register('license_id')}
            defaultValue={procedureSelected && procedureSelected.license.id}
            disabled={isProcedureFinished}
            required
          >
            {licensesArray.map((license) => (
              <option key={license.id} value={license.id}>
                {license.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="status_id" value="Estado" />
            {errors.status_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <Select
            icon={HiListBullet}
            id="status_id"
            {...register('status_id')}
            defaultValue={procedureSelected && procedureSelected.status.id}
            disabled={isProcedureFinished}
            required
          >
            {statusOriginal.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nombre}
              </option>
            ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="processor_id" value="Trámitador" />
            {errors.processor_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <AsyncSelect
            cacheOptions
            loadOptions={loadProcessorOptions}
            defaultOptions
            placeholder="Buscar Trámitador..."
            onChange={(selectedOption) => setValue('processor_id', selectedOption.value)}
            defaultValue={
              procedureSelected && procedureSelected.processor
                ? {
                    label: `${procedureSelected.processor.codigo} - ${procedureSelected.processor.nombres} ${procedureSelected.processor.apellidos}`,
                    value: procedureSelected.processor.id,
                  }
                : undefined
            }
            className="text-sm shadow shadow-gray-200"
            isDisabled={isProcedureFinished}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="customer_id" value="Cliente" />
            {errors.customer_id && (
              <Badge className="text-xs" color="failure">
                Campo Requerido
              </Badge>
            )}
          </div>
          <AsyncSelect
            cacheOptions
            loadOptions={loadCustomerOptions}
            defaultOptions
            placeholder="Buscar Cliente..."
            onChange={(selectedOption) => setValue('customer_id', selectedOption.value)}
            defaultValue={
              procedureSelected && procedureSelected.customer
                ? {
                    label: `${procedureSelected.customer.cedula} - ${procedureSelected.customer.nombres} ${procedureSelected.customer.apellidos}`,
                    value: procedureSelected.customer.id,
                  }
                : undefined
            }
            className="text-sm shadow shadow-gray-200"
            isDisabled={isProcedureFinished}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="valor" value="Valor" />
            {errors.valor && (
              <Badge className="text-xs" color="failure">
                {errors.valor.type === 'required' && 'Campo requerido'}
                {errors.valor.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="valor"
            defaultValue={procedureSelected && procedureSelected.valor}
            icon={HiCurrencyDollar}
            {...register('valor', { required: true, pattern: /^[0-9.]+$/i })}
            placeholder=""
            disabled={isProcedureFinished}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="valor_pendiente" value="Valor Pendiente" />
            {errors.valor_pendiente && (
              <Badge className="text-xs" color="failure">
                {errors.valor_pendiente.type === 'required' && 'Campo requerido'}
                {errors.valor_pendiente.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="valor_pendiente"
            defaultValue={procedureSelected && procedureSelected.valor_pendiente}
            icon={HiCurrencyDollar}
            {...register('valor_pendiente', { required: true, pattern: /^[0-9.]+$/i })}
            placeholder=""
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ganancia" value="Ganancia" />
            {errors.ganancia && (
              <Badge className="text-xs" color="failure">
                {errors.ganancia.type === 'required' && 'Campo requerido'}
                {errors.ganancia.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="ganancia"
            defaultValue={procedureSelected && procedureSelected.ganancia}
            icon={HiCurrencyDollar}
            {...register('ganancia', { required: true, pattern: /^[0-9.]+$/i })}
            placeholder=""
            disabled={isProcedureFinished}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ganancia_pendiente" value="Ganancia Pendiente" />
            {errors.ganancia_pendiente && (
              <Badge className="text-xs" color="failure">
                {errors.ganancia_pendiente.type === 'required' && 'Campo requerido'}
                {errors.ganancia_pendiente.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <TextInput
            id="ganancia_pendiente"
            defaultValue={procedureSelected && procedureSelected.ganancia_pendiente}
            icon={HiCurrencyDollar}
            {...register('ganancia_pendiente', { required: true, pattern: /^[0-9.]+$/i })}
            placeholder=""
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="placa" value="Placa" />
          </div>
          <TextInput
            id="placa"
            defaultValue={procedureSelected && procedureSelected.placa}
            icon={HiIdentification}
            placeholder=""
            {...register('placa')}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="observaciones" value="Observaciones" />
          </div>
          <TextInput
            id="observaciones"
            defaultValue={procedureSelected && procedureSelected.observaciones}
            icon={HiChatBubbleBottomCenterText}
            placeholder=""
            {...register('observaciones')}
          />
        </div>
      </fieldset>

      <fieldset className="flex items-center justify-end gap-2 mt-10">
        <Button color="blue" type="submit" className="mt-3">
          Guardar
        </Button>
        <Button color="red" onClick={closeModal} className="mt-3">
          Cancelar
        </Button>
      </fieldset>
    </form>
  )
}

CustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default CustomerForm
