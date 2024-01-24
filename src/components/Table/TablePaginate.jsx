import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

function TablePaginate({ currentPage, pageCount, handlePageChange }) {
  return (
    <footer>
      <ReactPaginate
        forcePage={currentPage}
        pageCount={pageCount}
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        nextClassName="ml-2"
        previousClassName="mr-2"
        containerClassName={'flex items-center gap-1 justify-center sm:justify-end mx-auto text-xs p-3'}
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
}

export default TablePaginate
