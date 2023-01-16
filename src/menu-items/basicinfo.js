// third-party
import { FormattedMessage } from 'react-intl';

// assets
import FeedIcon from '@mui/icons-material/Feed';

// icons
const icons = {
  FeedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const basicinfo = {
  id: 'group-basic-info',
  type: 'group',
  children: [
    {
      id: 'basicinfo',
      title: <FormattedMessage id="Basic Information" />,
      type: 'collapse',
      icon: icons.FeedIcon,
      children: [
        {
          id: 'roleposition',
          title: <FormattedMessage id="Role & Position Management" />,
          type: 'item',
          url: '/basicinfo/rolepos'
        },
        {
          id: 'department',
          title: <FormattedMessage id="Department Management" />,
          type: 'item',
          url: '/basicinfo/department'
        },
        {
          id: 'skillexp',
          title: <FormattedMessage id="Skill & Experience" />,
          type: 'item',
          url: '/basicinfo/skillexp'
        }
      ]
    }
  ]
};

export default basicinfo;
