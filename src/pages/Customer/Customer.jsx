import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavBar from '../../components/NavBar/NavBar'
import CustomerStats from './components/CustomerStats'
import { getClientes } from '../../redux/slices/CustomerSlice'

function Customer() {
  const dispatch = useDispatch()
  const { activeToken } = useSelector((store) => store.authentication)

  useEffect(() => {
    dispatch(getClientes(activeToken))
  }, [dispatch, activeToken])

  return (
    <section className="px-4 sm:px-8 sm:pb-4 sm:ml-64" id="customerSection">
      <header>
        <NavBar />
        <CustomerStats />
      </header>
      <main className="">
        {/*   {showModal && (
          <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full  grid place-items-center bg-black/50">
            <div className="relative w-full max-w-md max-h-full p-4">
              <div className="relative bg-white rounded-lg shadow">
                <div className="p-4 text-center md:p-5">
                  <h3 className="mb-3 font-normal text-gray-900 sm:text-2xl">¿Estas seguro/a de querer eliminarlo?</h3>
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                    onClick={() => {
                      onDeleteCustomer(customerID)
                    }}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </main>
    </section>
  )
}

export default Customer
