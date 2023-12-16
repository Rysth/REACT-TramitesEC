import PropTypes from 'prop-types'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { HiIdentification, HiMiniEnvelope, HiMiniUserCircle, HiMiniDevicePhoneMobile, HiMapPin } from 'react-icons/hi2'

function CustomerModal({ openModal, closeModal }) {
  return (
    <Modal show={openModal} position="center" onClose={closeModal} className="z-[9000]">
      <header className="p-4 border-b">
        <h3 className="text-xl sm:text-2xl">Nuevo Cliente</h3>
      </header>
      <Modal.Body>
        <form className="flex flex-col space-y-3">
          <fieldset className="grid gap-4 sm:gap-8 sm:grid-cols-2">
            <div>
              <Label htmlFor="cedula" value="Cédula" />
              <TextInput id="cedula" placeholder="0985736265" icon={HiIdentification} required />
            </div>
            <div>
              <Label htmlFor="nombres" value="Nombres" />
              <TextInput id="nombres" placeholder="John Doe" icon={HiMiniUserCircle} required />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:gap-8 sm:grid-cols-2">
            <div>
              <Label htmlFor="apellidos" value="Apellidos" />
              <TextInput id="apellidos" placeholder="Sánchez Castro" icon={HiMiniUserCircle} required />
            </div>
            <div>
              <Label htmlFor="celular" value="Celular" />
              <TextInput id="celular" placeholder="0966553564" icon={HiMiniDevicePhoneMobile} required />
            </div>
          </fieldset>
          <fieldset className="grid gap-4 sm:gap-8 sm:grid-cols-2">
            <div>
              <Label htmlFor="direccion" value="Dirección" />
              <TextInput id="direccion" placeholder="Av. de las Américas" icon={HiMapPin} required />
            </div>
            <div>
              <Label htmlFor="email" value="Correo Electrónico" />
              <TextInput id="email" placeholder="username@example.com" icon={HiMiniEnvelope} required />
            </div>
          </fieldset>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={closeModal} color="blue">
          Guardar
        </Button>
        <Button color="failure" onClick={closeModal}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

CustomerModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default CustomerModal
