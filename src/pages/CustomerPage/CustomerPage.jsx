import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <header>
        <h2 className="text-xl sm:text-2xl">Hola, John Palacios 👋</h2>
      </header>
    </SectionLayout>
  )
}

export default CustomerPage
