import React from 'react'
import PropTypes from 'prop-types'
import { Button, Label, TextInput, Modal } from 'flowbite-react'

function CustomerDrawer({ title, closeDrawer }) {
  return (
    <Modal size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900">{title}</h3>
          <div>
            <div className="block mb-2">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput id="email" placeholder="name@company.com" required />
          </div>
          <div>
            <div className="block mb-2">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          <div className="w-full">
            <Button>Log in to your account</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

CustomerDrawer.propTypes = {
  title: PropTypes.string.isRequired,
  closeDrawer: PropTypes.func.isRequired,
}

export default CustomerDrawer
