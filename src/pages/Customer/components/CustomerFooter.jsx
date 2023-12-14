import { useState } from 'react'
import { Button } from '@material-tailwind/react'
import CustomerDialog from './CustomerDialog'

function CustomerFooter() {
  const [showDrawer, setShowDrawer] = useState(false)

  const openDrawer = () => setShowDrawer(true)
  const closeDrawer = () => setShowDrawer(false)

  return (
    <main>
      {showDrawer && <CustomerDialog title="Nuevo Cliente" closeDrawer={closeDrawer} />}
      <div className="flex justify-end">
        <Button size="sm" color="green" onClick={openDrawer}>
          Crear
        </Button>
      </div>
    </main>
  )
}

export default CustomerFooter
