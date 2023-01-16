import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import MainCard from 'components/MainCard';
import { Grid, Divider, CardContent, Typography, Button, Modal, IconButton, TextField, Box, Stack, FormHelperText } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { openSnackbar } from 'store/reducers/snackbar';
import useScriptRef from 'hooks/useScriptRef';

import ReactTable from 'components/ReactTable';
import FocusError from 'components/FocusError';

import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';

import Loader from 'components/Loader';

import useFlexHR from 'hooks/useFlexHR';

export default function RolePosition() {
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();

  const { getRolePositionList, deleteRolePosition, createRolePosition, updateRolePosition, getSoll, setSoll } = useFlexHR();

  const [rolePositionList, setRolePositionList] = useState([]);

  const [curRolePositionID, setCurRolePositionID] = useState(0);
  const [curRolePosition, setCurRolePosition] = useState({});

  const [sollValue, setSollValue] = useState();

  const [loading, setLoading] = useState(false);

  const [openDeleteRolePosition, setOpenDeleteRolePosition] = useState(false);
  const handleDeleteRolePositionOpen = () => setOpenDeleteRolePosition(true);
  const handleDeleteRolePositionClose = () => setOpenDeleteRolePosition(false);

  const [openCreateRolePosition, setOpenCreateRolePosition] = useState(false);
  const handleCreateRolePositionOpen = () => setOpenCreateRolePosition(true);
  const handleCreateRolePositionClose = () => setOpenCreateRolePosition(false);

  const [openEditRolePosition, setOpenEditRolePosition] = useState(false);
  const handleEditRolePositionOpen = () => setOpenEditRolePosition(true);
  const handleEditRolePositionClose = () => setOpenEditRolePosition(false);

  const columns = useMemo(
    () => [
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>#</Typography>;
        },
        accessor: 'idx', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Role Name</Typography>;
        },
        accessor: 'RoleName', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Initial</Typography>;
        },
        accessor: 'Initial', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Expected Sales</Typography>;
        },
        accessor: 'ExpSale', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value} €</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Action</Typography>;
        },
        accessor: 'id', // eslint-disable-next-line
        Cell: ({ value }) => {
          return (
            <Box style={{ textAlign: 'center' }}>
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  rolePositionList?.forEach((item) => {
                    if (item?.id === value) {
                      setCurRolePosition(item);
                    }
                  });
                  handleEditRolePositionOpen();
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  setCurRolePositionID(value);
                  handleDeleteRolePositionOpen();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }
      }
    ],
    [rolePositionList]
  );

  const makeRolePositionList = (data) => {
    let tmpArr = [];
    data?.forEach((item, idx) => {
      tmpArr.push({
        idx: idx + 1,
        RoleName: item.RoleName,
        Initial: item.Initial,
        ExpSale: item?.ExpSale,
        id: item?.id
      });
    });
    setRolePositionList(tmpArr);
  };

  const handleDeleteRolePosition = async () => {
    const res = await deleteRolePosition(curRolePositionID);
    if (res?.status) {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Success to delete role & position',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
      handleDeleteRolePositionClose();
      makeRolePositionList(res?.data);
    } else {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.data,
            variant: 'alert',
            alert: { color: 'error' }
          })
        );
      }
    }
  };

  const saveSollValue = async () => {
    const res = await setSoll(sollValue);
    if (res === true) {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Success to save soll',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
    } else {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: res,
            variant: 'alert',
            alert: { color: 'error' }
          })
        );
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getRolePositionList().then((rolepositionData) => {
      setLoading(false);
      makeRolePositionList(rolepositionData);
    });

    getSoll().then((soll) => {
      setSollValue(soll);
    });
  }, [getRolePositionList, getSoll]);

  return (
    <>
      {loading && <Loader />}
      <MainCard
        title="SOLL"
        sx={{ width: { xs: '100%', md: '50%' } }}
        secondary={
          <Button variant="contained" onClick={saveSollValue}>
            Save
          </Button>
        }
      >
        <Grid container spacing={2} display="flex" alignItems="center">
          <Grid item>
            <Typography>SOLL = based on necessary monthly sales/revenue</Typography>
          </Grid>
          <Grid item>
            <TextField
              type="number"
              sx={{ width: 140, '& .MuiInputBase-input': { textAlign: 'center' } }}
              value={sollValue}
              onChange={(e) => {
                setSollValue(e.target.value);
              }}
            />
          </Grid>
          <Grid item>€</Grid>
        </Grid>
      </MainCard>
      <MainCard
        title="Role & Position List"
        sx={{ width: '100%', mt: 3 }}
        secondary={
          <Button variant="contained" onClick={handleCreateRolePositionOpen}>
            Add New Role
          </Button>
        }
      >
        <Grid container spacing={2} display="flex" alignItems="center">
          <Grid item xs={12}>
            <ReactTable columns={columns} data={rolePositionList} getHeaderProps={(column) => column.getSortByToggleProps()} />
          </Grid>
        </Grid>
      </MainCard>
      <Modal
        open={openDeleteRolePosition}
        onClose={handleDeleteRolePositionClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MainCard title="Delete RolePosition" modal darkTitle content={false} sx={{ width: { xs: '90%', md: '640px' } }}>
          <CardContent>
            <Typography gutterBottom>Do you want to delete this role?</Typography>
          </CardContent>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
            <Button color="error" onClick={handleDeleteRolePositionClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDeleteRolePosition}>
              Yes
            </Button>
          </Stack>
        </MainCard>
      </Modal>
      <Modal
        open={openCreateRolePosition}
        onClose={handleCreateRolePositionClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          enableReinitialize
          initialValues={{
            RoleName: '',
            Initial: '',
            ExpSale: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            RoleName: Yup.string().nullable().max(64, 'Role name length should be less than 64').required('Role name is required'),
            Initial: Yup.string().nullable().max(64, 'Initial length should be less than 64').required('Initial is required'),
            ExpSale: Yup.number()
              .integer('Expected sales should be an integer')
              .nullable()
              .min(1, 'Expected sales should be greater than 0')
              .required('Expected sales is required')
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            const res = await createRolePosition(values);
            if (res.status === true) {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Success to create a role',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    }
                  })
                );
              }
              makeRolePositionList(res.data);
              handleCreateRolePositionClose();
            } else {
              if (scriptedRef.current) {
                setStatus({ success: false });
                dispatch(
                  openSnackbar({
                    open: true,
                    message: res?.data,
                    variant: 'alert',
                    alert: {
                      color: 'error'
                    }
                  })
                );
                setSubmitting(false);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <MainCard
                title="Create Role"
                modal
                darkTitle
                content={false}
                sx={{ width: { xs: '90%', md: '840px' } }}
                secondary={
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    Save
                  </Button>
                }
              >
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography>Role Name</Typography>
                      <TextField fullWidth name="RoleName" value={values.RoleName} onBlur={handleBlur} onChange={handleChange} />
                      {touched.RoleName && errors.RoleName && (
                        <FormHelperText error id="helper-text-RoleName-RolePosition">
                          {errors.RoleName}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Initial</Typography>
                      <TextField fullWidth name="Initial" value={values.Initial} onBlur={handleBlur} onChange={handleChange} />
                      {touched.Initial && errors.Initial && (
                        <FormHelperText error id="helper-text-Initial-RolePosition">
                          {errors.Initial}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Expected Sales</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        name="ExpSale"
                        value={values.ExpSale}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.ExpSale && errors.ExpSale && (
                        <FormHelperText error id="helper-text-ExpSale-RolePosition">
                          {errors.ExpSale}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </MainCard>
              <FocusError />
            </form>
          )}
        </Formik>
      </Modal>
      <Modal
        open={openEditRolePosition}
        onClose={handleEditRolePositionClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          enableReinitialize
          initialValues={{
            RoleName: curRolePosition?.RoleName,
            Initial: curRolePosition?.Initial,
            ExpSale: curRolePosition?.ExpSale,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            RoleName: Yup.string().nullable().max(64, 'Role name length should be less than 64').required('Role name is required'),
            Initial: Yup.string().nullable().max(64, 'Initial length should be less than 64').required('Initial is required'),
            ExpSale: Yup.number()
              .integer('Expected sales should be an integer')
              .nullable()
              .min(1, 'Expected sales should be greater than 0')
              .required('Expected sales is required')
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            const res = await updateRolePosition(curRolePosition?.id, values);
            if (res.status === true) {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Success to update a role',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    }
                  })
                );
              }
              makeRolePositionList(res.data);
              handleEditRolePositionClose();
            } else {
              if (scriptedRef.current) {
                setStatus({ success: false });
                dispatch(
                  openSnackbar({
                    open: true,
                    message: res?.data,
                    variant: 'alert',
                    alert: {
                      color: 'error'
                    }
                  })
                );
                setSubmitting(false);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <MainCard
                title="Edit Role"
                modal
                darkTitle
                content={false}
                sx={{ width: { xs: '90%', md: '840px' } }}
                secondary={
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    Update
                  </Button>
                }
              >
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography>Role Name</Typography>
                      <TextField fullWidth name="RoleName" value={values.RoleName} onBlur={handleBlur} onChange={handleChange} />
                      {touched.RoleName && errors.RoleName && (
                        <FormHelperText error id="helper-text-RoleName-RolePosition">
                          {errors.RoleName}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Initial</Typography>
                      <TextField fullWidth name="Initial" value={values.Initial} onBlur={handleBlur} onChange={handleChange} />
                      {touched.Initial && errors.Initial && (
                        <FormHelperText error id="helper-text-Initial-RolePosition">
                          {errors.Initial}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Expected Sales</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        name="ExpSale"
                        value={values.ExpSale}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.ExpSale && errors.ExpSale && (
                        <FormHelperText error id="helper-text-ExpSale-RolePosition">
                          {errors.ExpSale}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </MainCard>
              <FocusError />
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
