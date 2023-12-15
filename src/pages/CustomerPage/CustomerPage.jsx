import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientes } from '../../redux/slices/CustomerSlice'
import SectionLayout from '../../layouts/SectionLayout/SectionLayout'
import HeaderLayout from '../../layouts/HeaderLayout'

function CustomerPage() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <SectionLayout>
      <HeaderLayout />
    </SectionLayout>
  )
}

export default CustomerPage
