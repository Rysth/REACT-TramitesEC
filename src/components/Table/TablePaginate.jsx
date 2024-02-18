import { Button } from '@tremor/react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { IoCreateSharp } from 'react-icons/io5'
import ReactPaginate from 'react-paginate'

function TablePaginate({ currentPage, pageCount, handlePageChange, showModal }) {
  return (
    <footer className={`flex items-center justify-between p-2 md:p-4 ${!showModal && '!justify-end !px-2'}`}>
      {showModal && (
        <div>
          <div className="flex items-center justify-end w-full gap-1 sm:max-w-max">
            <Button color="green" onClick={showModal} className="flex items-center">
              Crear
              <IoCreateSharp className="inline-block ml-1" />
            </Button>
          </div>
        </div>
      )}
      <ReactPaginate
        forcePage={currentPage}
        pageCount={pageCount}
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        onPageChange={handlePageChange}
        nextClassName="ml-1"
        previousClassName="mr-1"
        containerClassName={'flex items-center gap-1 justify-center text-xs p-3'}
        activeClassName={'rounded-md bg-[var(--CL-primary)] text-white'}
        pageLinkClassName="p-2 outline-1 block px-3.5 transition rounded font-semibold hover:bg-gray-200"
      />
    </footer>
  )
}

TablePaginate.propTypes = {
  currentPage: PropTypes.number,
  pageCount: PropTypes.number,
  handlePageChange: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
}

export default TablePaginate
