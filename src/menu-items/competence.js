// third-party
import { FormattedMessage } from 'react-intl';

// assets
import TaskIcon from '@mui/icons-material/Task';

// icons
const icons = {
  TaskIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const competence = {
  id: 'group-competence-management',
  type: 'group',
  children: [
    {
      id: 'competence',
      title: <FormattedMessage id="Competence Management" />,
      type: 'item',
      icon: icons.TaskIcon,
      url: '/competence'
    }
  ]
};

export default competence;
