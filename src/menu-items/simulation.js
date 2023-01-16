// third-party
import { FormattedMessage } from 'react-intl';

// assets
import BiotechIcon from '@mui/icons-material/Biotech';

// icons
const icons = {
  BiotechIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const simulationcompare = {
  id: 'group-simulation-compare',
  type: 'group',
  children: [
    {
      id: 'simulationcompare',
      title: <FormattedMessage id="Simulation & Compare" />,
      type: 'collapse',
      icon: icons.BiotechIcon,
      children: [
        {
          id: 'simulation',
          title: <FormattedMessage id="Simulation" />,
          type: 'item',
          url: '/sc/simulation'
        },
        {
          id: 'compare',
          title: <FormattedMessage id="Compare" />,
          type: 'item',
          url: '/sc/compare'
        }
      ]
    }
  ]
};

export default simulationcompare;
