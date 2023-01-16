// project import
import MainLayout from 'layout/MainLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

// context
import { FlexHRProvider } from 'contexts/FlexHRContext';

// render - dashboard
import DashboardDefault from 'pages/dashboard';
import Department from 'pages/basic/department';
import RolePosition from 'pages/basic/role';
import SkillExperience from 'pages/basic/skill';
import CompetenceManagement from 'pages/competence';
import UserManagement from 'pages/usermanage';
import Simulation from 'pages/simulationcompare/simulation';
import Compare from 'pages/simulationcompare/compare';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'basicinfo',
          children: [
            {
              path: 'department',
              element: (
                <FlexHRProvider>
                  <Department />
                </FlexHRProvider>
              )
            },
            {
              path: 'rolepos',
              element: (
                <FlexHRProvider>
                  <RolePosition />
                </FlexHRProvider>
              )
            },
            {
              path: 'skillexp',
              element: (
                <FlexHRProvider>
                  <SkillExperience />
                </FlexHRProvider>
              )
            }
          ]
        },
        {
          path: 'competence',
          element: (
            <FlexHRProvider>
              <CompetenceManagement />
            </FlexHRProvider>
          )
        },
        {
          path: 'usermanage',
          element: <UserManagement />
        },
        {
          path: 'sc',
          children: [
            {
              path: 'simulation',
              element: <Simulation />
            },
            {
              path: 'compare',
              element: <Compare />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
