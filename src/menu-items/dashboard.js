// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined, GoldOutlined, HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  GoldOutlined,
  HomeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon: icons.DashboardOutlined,
      url: '/dashboard'
    }
  ]
};

export default dashboard;
