// third-party
import { FormattedMessage } from 'react-intl';

// assets
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// icons
const icons = {
  ManageAccountsIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const usermanage = {
  id: 'group-user-management',
  type: 'group',
  children: [
    {
      id: 'usermanage',
      title: <FormattedMessage id="User Management" />,
      type: 'item',
      icon: icons.ManageAccountsIcon,
      url: '/usermanage'
    }
  ]
};

export default usermanage;
