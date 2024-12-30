import { Button } from '@tremor/react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { IoCreateSharp } from 'react-icons/io5'
import ReactPaginate from 'react-paginate'

function TablePaginate({ currentPage, pageCount, handlePageChange, showModal }) {
  return (
    <footer
      className={`flex items-center justify-between p-2 md:p-4 rounded-b-lg border-t mt-1 ${!showModal && '!justify-end !px-2'}`}
    >
      {showModal && (
        <div>
          <div className="flex items-center justify-end w-full gap-1 sm:max-w-max">
            <button className="flex items-center btn btn-success btn-sm" onClick={showModal}>
              Crear
              <IoCreateSharp className="inline-block ml-1" />
            </button>
          </div>
        </div>
      )}
      <ReactPaginate
        forcePage={currentPage}
        pageCount={pageCount}
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        nextClassName="btn btn-primary btn-sm ml-1 max-w-[2.25rem]"
        previousClassName="btn btn-primary btn-sm mr-1 max-w-[2.25rem]"
        containerClassName={'flex items-center gap-1 '}
        activeClassName={'btn btn-primary btn-sm h-full max-w-[2.25rem]'}
        pageLinkClassName="btn btn-ghost btn-sm"
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
