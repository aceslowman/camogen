import PropTypes from 'prop-types';
import useResizeObserver from '@react-hook/resize-observer'

const useObserver = (
    callback,
    element
) => {
    useResizeObserver(element.current, callback)
};

useObserver.propTypes = {
    element: PropTypes.object,
    callback: PropTypes.func,
};

export default useObserver;