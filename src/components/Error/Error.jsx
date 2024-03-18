import PropTypes from 'prop-types'
import { RiErrorWarningFill } from 'react-icons/ri'

function Error({ title }) {
  return (
    <header className="flex flex-col items-center justify-center h-full text-xl text-center  min-h-[35rem] max-h-96 sm:text-2xl ">
      <RiErrorWarningFill className="w-32 h-32 text-red-700 sm:h-40 sm:w-40" />
      <h3>{title}</h3>
    </header>
  )
}

Error.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Error
