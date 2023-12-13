import { useState } from 'react'
import { Button } from 'flowbite-react'
import CustomerDrawer from './CustomerDrawer'

function CustomerFooter() {
  const [showDrawer, setShowDrawer] = useState(false)

  const openDrawer = () => setShowDrawer(true)
  const closeDrawer = () => setShowDrawer(false)

  return (
    <main>
      {showDrawer && <CustomerDrawer title="Nuevo Cliente" closeDrawer={closeDrawer} />}
      <div className="flex justify-end">
        <Button size="xs" color="success" className="bg-green-500" onClick={() => openDrawer()}>
          Crear
        </Button>
      </div>
    </main>
  )
}

export default CustomerFooter
