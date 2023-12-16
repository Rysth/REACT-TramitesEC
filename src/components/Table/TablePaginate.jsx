import ReactPaginate from 'react-paginate'

function TablePaginate({ currentPage, pageCount, handlePageChange }) {
  return (
    <footer>
      <ReactPaginate
        previousLabel={'<<'}
        forcePage={currentPage}
        nextLabel={'>>'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={'flex items-center gap-1 justify-center sm:justify-end mx-auto text-sm p-4'}
        subContainerClassName={'mx-2'}
        activeClassName={'active'}
        pageLinkClassName="p-2 outline-1 block px-4"
      />
    </footer>
  )
}

export default TablePaginate
