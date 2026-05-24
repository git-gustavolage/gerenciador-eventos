import { useCallback, useRef, useState } from "react";

export default function useData(value) {
  const [_state, _setState] = useState(value);

  const stateRef = useRef(_state);

  const clear = () => _setState(value);

  const setData = useCallback((key, value) => {
    if (stateRef.current[key] !== value) {
      stateRef.current = {
        ...stateRef.current,
        [key]: value
      };

      _setState((previousState) => ({
        ...previousState,
        [key]: value
      }))
    }
  }, [_setState]);

  return [_state, setData, clear];
}
