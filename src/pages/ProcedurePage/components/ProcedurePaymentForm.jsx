import { Button, TextInput, Table, TableBody, TableHead, TableHeaderCell, TableRow, TableCell } from '@tremor/react'
import { Badge, Label, Select } from 'flowbite-react'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiCurrencyDollar, HiDocument, HiDocumentCheck, HiMiniTrash } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createPayment, deletePayment, getPayments } from '../../../redux/slices/SharedSlice'

const ProcedurePaymentForm = ({ refetchFunction, closeModal }) => {
  const { procedureSelected } = useSelector((store) => store.procedure)
  const { paymentsTypeOriginal, paymentsOriginal } = useSelector((store) => store.shared)
  const dispatch = useDispatch()
  const { activeToken } = useSelector((state) => state.authentication)
  const [paymentType, setPaymentType] = useState(1)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = (paymentData) => {
    const procedure_id = procedureSelected?.id // Get procedure_id from procedureSelected
    const updatedPaymentData = { ...paymentData, procedure_id } // Include procedure_id in paymentData
    dispatch(createPayment({ activeToken, paymentData: updatedPaymentData }))
      .then(() => {
        dispatch(getPayments({ activeToken, procedureID: procedureSelected.id }))
          .then(() => refetchFunction())
          .then(() => reset())
          .then(() => closeModal())
      })
      .catch((error) => {
        // Display error message if payment creation fails
        toast.error('Error al crear el pago. Por favor, inténtalo de nuevo.', { autoClose: 2000 })
        console.error('Error creating payment:', error)
      })
  }

  const handleDeletePayment = (paymentID) => {
    dispatch(deletePayment({ activeToken, paymentID }))
      .then(() => refetchFunction())
      .then(() => reset())
      .then(() => closeModal())
  }

  useEffect(() => {
    dispatch(getPayments({ activeToken, procedureID: procedureSelected.id }))
  }, [dispatch, activeToken, procedureSelected.id])

  useEffect(() => {
    setValue('payment_type_id', 1)
  }, [setValue])

  const isNotPending = procedureSelected?.is_paid

  return (
    <div className="space-y-4">
      <form className="grid space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="payment_type_id" className="label-text">
                Forma de Pago
              </label>
              {errors.payment_type_id && (
                <span className="badge-sm badge badge-error">
                  {errors.payment_type_id.type === 'required' && 'Campo requerido'}
                  {errors.payment_type_id.type === 'pattern' && 'Solo números'}
                </span>
              )}
            </div>
            <div className="relative">
              <HiDocument className="absolute text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
              <select
                id="payment_type_id"
                {...register('payment_type_id')}
                defaultValue={1}
                onChange={(e) => setPaymentType(parseInt(e.target.value))}
                required
                disabled={isNotPending}
                className="w-full pl-10 input input-bordered"
              >
                {paymentsTypeOriginal.length > 0 &&
                  paymentsTypeOriginal.map((payment_type) => (
                    <option key={payment_type.id} value={payment_type.id}>
                      {payment_type.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="value" className="label-text">
                Valor
              </label>
              {errors.value && (
                <span className="badge-sm badge badge-error">
                  {errors.value.type === 'required' && 'Campo requerido'}
                  {errors.value.type === 'pattern' && 'Solo números'}
                  {errors.value.type === 'positive' && 'Solo valores positivos'}
                  {errors.value.type === 'max' && 'Solo valores menores al valor pendiente'}
                </span>
              )}
            </div>
            <div className="relative">
              <HiCurrencyDollar className="absolute text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                id="value"
                defaultValue={procedureSelected && procedureSelected.value}
                {...register('value', {
                  required: true,
                  pattern: /^[0-9.]+$/i,
                  validate: {
                    positive: (value) => parseFloat(value) >= 0 || 'Solo valores positivos',
                    max: (value) =>
                      parseFloat(value) <= procedureSelected.cost_pending || 'Solo valores menores al valor pendiente',
                  },
                })}
                placeholder=""
                disabled={isNotPending}
                className="w-full pl-10 input input-bordered"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="receipt_number" className="label-text">
                Comprobante
              </label>
              {errors.receipt_number && (
                <span className="badge-sm badge badge-error">
                  {errors.receipt_number.type === 'required' && 'Campo requerido'}
                </span>
              )}
            </div>
            <div className="relative">
              <HiDocumentCheck className="absolute text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                id="receipt_number"
                defaultValue={procedureSelected && procedureSelected.value}
                {...register('receipt_number', { required: paymentType !== 1 })}
                disabled={paymentType === 1}
                placeholder=""
                className="w-full pl-10 input input-bordered"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="flex items-center justify-end gap-2 p-4 px-0 pt-0">
          <button type="submit" className="btn btn-sm btn-success" disabled={isNotPending}>
            Guardar
          </button>
          <button type="button" className="btn btn-sm btn-error" onClick={closeModal}>
            Cancelar
          </button>
        </fieldset>
      </form>
      <fieldset className="relative overflow-x-auto max-h-64">
        <table className="table w-full bg-white">
          <thead className="bg-neutral-100">
            <tr>
              <th className="w-[5%] text-xs">Fecha</th>
              <th className="text-xs w-max">Forma de Pago</th>
              <th className="w-[10%] text-xs">Valor</th>
              <th className="w-[20%] text-xs">Comprobante</th>
              <th className="w-[10%] text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y">
            {paymentsOriginal.length > 0 &&
              paymentsOriginal.map((payment) => (
                <tr key={payment.id} className="bg-white hover">
                  <td className="font-medium text-gray-900 whitespace-nowrap  !py-1">{payment.date}</td>
                  <td className="truncate">{payment.payment_type.name}</td>
                  <td>${payment.value}</td>
                  <td>{payment?.receipt_number}</td>
                  <td className="!py-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <span className="sr-only">Eliminar</span>
                      <HiMiniTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  )
}

ProcedurePaymentForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcedurePaymentForm
