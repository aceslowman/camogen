import { useEffect } from "react";
import PropTypes from "prop-types";
import tinykeys from "tinykeys";

const useKeymap = (keymap, active) => {
  useEffect(() => {
    if (active) {
      let unsubscribe = tinykeys(window, keymap);
      return unsubscribe;
    }
  }, [keymap, active]);
};

useKeymap.propTypes = {
  keymap: PropTypes.object,
  active: PropTypes.bool
};

export default useKeymap;