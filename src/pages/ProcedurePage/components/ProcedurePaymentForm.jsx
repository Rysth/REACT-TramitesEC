import { TextInput } from '@tremor/react'
import { Badge, Label, Select } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiCurrencyDollar, HiDocument } from 'react-icons/hi2'
import { useSelector } from 'react-redux'

const ProcedurePaymentForm = () => {
  const { procedureSelected } = useSelector((store) => store.procedure)
  const { paymentsOriginal } = useSelector((store) => store.shared)
  const [paymentType, setPaymentType] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  return (
    <div className="space-y-4">
      <fieldset className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="payment_type_id" value="Tipo de Pago" />
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
            defaultValue={procedureSelected && procedureSelected.procedure_type.id}
            onChange={(e) => setPaymentType(parseInt(e.target.value))}
            required
          >
            {paymentsOriginal.map((payment_type) => (
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
              </Badge>
            )}
          </div>
          <TextInput
            id="value"
            defaultValue={procedureSelected && procedureSelected.value}
            icon={HiCurrencyDollar}
            {...register('value', { required: true, pattern: /^[0-9.]+$/i })}
            placeholder=""
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
            icon={HiCurrencyDollar}
            {...register('receipt_number', { required: true })}
            disabled={paymentType === 1}
            placeholder=""
          />
        </div>
      </fieldset>
    </div>
  )
}

export default ProcedurePaymentForm
