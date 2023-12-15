import React from 'react'
import { Button, Dialog, Card, CardHeader, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createCliente } from '../../../redux/slices/CustomerSlice'

export function CustomerDialog({ title, closeDrawer }) {
  const dispatch = useDispatch()
  const { activeToken, activeUser } = useSelector((store) => store.authentication)
  const { register, handleSubmit } = useForm()

  const onSubmit = (customerData) => {
    const newCustomer = {
      cliente: {
        ...customerData,
        user_id: activeUser.id,
      },
    }
    dispatch(createCliente({ activeToken, newCustomer })).then(() => closeDrawer())
  }

  return (
    <>
      <Dialog size="sm" open={open} handler={closeDrawer} className="bg-transparent shadow-none">
        <Card className="w-full mx-auto">
          <CardHeader className="text-center bg-gray-900">
            <Typography variant="h2" color="white" className="font-bold">
              {title}
            </Typography>
          </CardHeader>
          <CardBody className="grid gap-4 my-5 sm:gap-10">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Input label="Cédula" variant="static" placeholder="0985642634" {...register('cedula')} required />
              <Input label="Nombres" variant="static" placeholder="John Doe" {...register('nombres')} required />
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Apellidos"
                variant="static"
                placeholder="Sanchéz Rodríguez"
                {...register('apellidos')}
                required
              />
              <Input label="Celular" variant="static" placeholder="0985643652" {...register('celular')} required />
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Dirección"
                variant="static"
                placeholder="Av. Delta Central"
                {...register('direccion')}
                required
              />
              <Input
                label="Email"
                type="email"
                variant="static"
                placeholder="username@example.com"
                {...register('email')}
                required
              />
            </fieldset>
          </CardBody>
          <CardFooter className="flex items-center gap-2 pt-0">
            <Button color="red" onClick={closeDrawer} fullWidth>
              Cancelar
            </Button>
            <Button fullWidth color="indigo" type="submit" onClick={handleSubmit(onSubmit)}>
              Registrar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}

export default CustomerDialog
