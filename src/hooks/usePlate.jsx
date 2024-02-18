import { useState, useEffect } from 'react'

const usePlate = (selectedProcedureType) => {
  const [shouldUsePlate, setShouldUsePlate] = useState(false)

  useEffect(() => {
    if (selectedProcedureType) {
      const excludedIds = [1, 11, 12, 13, 14, 16, 17, 18, 21, 22]
      setShouldUsePlate(!excludedIds.includes(selectedProcedureType.id))
    }
  }, [selectedProcedureType])

  return shouldUsePlate
}

export default usePlate
