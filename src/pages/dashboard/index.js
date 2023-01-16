import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export default function DashboardDefault() {
  return (
    <>
      {/* <Grid container spacing={1}>
        <Grid item sx={{ mt: 1, mb: 3.5 }}>
          <Typography variant="h2">Dashboard</Typography>
        </Grid>
      </Grid> */}
      <MainCard title="Coming Soon" sx={{ width: '100%' }}>
        <Typography gutterBottom>We are working on this new exciting feature.</Typography>
      </MainCard>
    </>
  );
}
