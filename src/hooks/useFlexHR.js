import { useContext } from 'react';

// FlexHR provider
import FlexHRContext from 'contexts/FlexHRContext';

// ==============================|| AUTH HOOKS ||============================== //

const useFlexHR = () => {
  const context = useContext(FlexHRContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useFlexHR;
