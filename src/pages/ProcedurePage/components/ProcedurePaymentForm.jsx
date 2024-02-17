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
  }, [])

  useEffect(() => {
    setValue('payment_type_id', 1)
  }, [setValue])

  const isNotPending = procedureSelected?.is_paid

  return (
    <div className="space-y-4">
      <fieldset className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="payment_type_id" value="Forma de Pago" />
            {errors.payment_type_id && (
              <Badge className="text-xs" color="failure">
                {errors.payment_type_id.type === 'required' && 'Campo requerido'}
                {errors.payment_type_id.type === 'pattern' && 'Solo números'}
              </Badge>
            )}
          </div>
          <Select
            icon={HiDocument}
            id="payment_type_id"
            {...register('payment_type_id')}
            defaultValue={1}
            onChange={(e) => setPaymentType(parseInt(e.target.value))}
            required
            disabled={isNotPending}
          >
            {paymentsTypeOriginal.length > 0 &&
              paymentsTypeOriginal.map((payment_type) => (
                <option key={payment_type.id} value={payment_type.id}>
                  {payment_type.name}
                </option>
              ))}
          </Select>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="value" value="Valor" />
            {errors.value && (
              <Badge className="text-xs" color="failure">
                {errors.value.type === 'required' && 'Campo requerido'}
                {errors.value.type === 'pattern' && 'Solo números'}
                {errors.value.type === 'positive' && 'Solo valores positivos'}
                {errors.value.type === 'max' && 'Solo valores menores al valor pendiente'}
              </Badge>
            )}
          </div>
          <TextInput
            id="value"
            defaultValue={procedureSelected && procedureSelected.value}
            icon={HiCurrencyDollar}
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
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="receipt_number" value="Comprobante" />
            {errors.receipt_number && (
              <Badge className="text-xs" color="failure">
                {errors.receipt_number.type === 'required' && 'Campo requerido'}
              </Badge>
            )}
          </div>
          <TextInput
            id="receipt_number"
            defaultValue={procedureSelected && procedureSelected.value}
            icon={HiDocumentCheck}
            {...register('receipt_number', { required: paymentType !== 1 })}
            disabled={paymentType === 1}
            placeholder=""
          />
        </div>
      </fieldset>
      <fieldset className="flex items-center justify-end">
        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isNotPending}>
          Guardar
        </Button>
      </fieldset>
      <fieldset className="relative overflow-x-auto max-h-64">
        <Table striped>
          <TableHead className="sticky top-0">
            <TableHeaderCell className="w-[5%] text-xs">Fecha</TableHeaderCell>
            <TableHeaderCell className="text-xs w-max">Forma de Pago</TableHeaderCell>
            <TableHeaderCell className="w-[10%] text-xs">Valor</TableHeaderCell>
            <TableHeaderCell className="w-[20%] text-xs">Comprobante</TableHeaderCell>
            <TableHeaderCell className="w-[10%] text-xs">Acciones</TableHeaderCell>
          </TableHead>
          <TableBody className="text-xs divide-y">
            {paymentsOriginal.length > 0 &&
              paymentsOriginal.map((payment) => (
                <TableRow key={payment.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap dark:text-white  !py-1">
                    {payment.date}
                  </TableCell>
                  <TableCell className="truncate">{payment.payment_type.name}</TableCell>
                  <TableCell>${payment.value}</TableCell>
                  <TableCell>{payment?.receipt_number}</TableCell>
                  <TableCell className="!py-1">
                    <Button
                      type="button"
                      className="!text-xs"
                      onClick={() => handleDeletePayment(payment.id)}
                      size="xs"
                      color="red"
                    >
                      <span className="sr-only">Eliminar</span>
                      <HiMiniTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </fieldset>
    </div>
  )
}

ProcedurePaymentForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refetchFunction: PropTypes.func.isRequired,
}

export default ProcedurePaymentForm
