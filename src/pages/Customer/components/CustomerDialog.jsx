import React from 'react'
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from '@material-tailwind/react'

export function CustomerDialog({ title, closeDrawer }) {
  return (
    <>
      <Dialog size="sm" open={open} handler={closeDrawer} className="bg-transparent shadow-none">
        <Card className="w-full mx-auto">
          <CardHeader className="text-center bg-gray-900">
            <Typography variant="h2" color="white" className="font-bold">
              {title}
            </Typography>
          </CardHeader>
          <CardBody className="grid gap-4 sm:gap-6">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Cédula
                <Input size="sm" variant="static" placeholder="0985642634" />
              </Typography>
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Nombres
                <Input size="sm" variant="static" placeholder="John Doe" />
              </Typography>
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Apellidos
                <Input size="sm" variant="static" placeholder="Sanchéz Rodríguez" />
              </Typography>
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Celular
                <Input size="sm" variant="static" placeholder="0985643652" />
              </Typography>
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Dirección
                <Input size="sm" variant="static" placeholder="Av. Delta Central" />
              </Typography>
              <Typography className="-mb-3 font-bold" variant="small" color="black">
                Email
                <Input size="sm" type="email" variant="static" placeholder="username@example.com" />
              </Typography>
            </fieldset>
          </CardBody>
          <CardFooter className="flex items-center gap-2 pt-4">
            <Button color="red" onClick={closeDrawer} fullWidth>
              Cancelar
            </Button>
            <Button onClick={closeDrawer} fullWidth color="indigo">
              Registrar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}

export default CustomerDialog
