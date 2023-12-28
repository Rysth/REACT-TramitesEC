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
        containerClassName={'flex items-center gap-1 justify-center sm:justify-end mx-auto text-xs p-4'}
        subContainerClassName={'mx-2'}
        activeClassName={'rounded-lg text-white font-bold bg-[var(--CL-primary)]'}
        pageLinkClassName="p-2 outline-1 block px-4 md:hover:shadow-xl transition"
      />
    </footer>
  )
}

TablePaginate.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
}

export default TablePaginate
