import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import MainCard from 'components/MainCard';
import {
  Grid,
  MenuItem,
  Select,
  Divider,
  CardContent,
  Typography,
  Button,
  Modal,
  IconButton,
  TextField,
  Box,
  Stack,
  FormHelperText
} from '@mui/material';
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

export default function Department() {
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();

  const { getDepartmentList, getCompetenceList, getRateTypes, deleteCompetence, createCompetence, updateCompetence, getRolePositionList } =
    useFlexHR();

  const [curDepartment, setCurDepartment] = useState(0);
  const [departmentList, setDepartmentList] = useState([]);
  const [competenceList, setCompetenceList] = useState([]);
  const [rolePositionList, setRolePositionList] = useState([]);

  const [rateTypes, setRateTypes] = useState([]);

  const [curCompetenceID, setCurCompetenceID] = useState(0);
  const [curCompetence, setCurCompetence] = useState({});

  const [loading, setLoading] = useState(false);

  const [openDeleteCompetence, setOpenDeleteCompetence] = useState(false);
  const handleDeleteCompetenceOpen = () => setOpenDeleteCompetence(true);
  const handleDeleteCompetenceClose = () => setOpenDeleteCompetence(false);

  const [openCreateCompetence, setOpenCreateCompetence] = useState(false);
  const handleCreateCompetenceOpen = () => setOpenCreateCompetence(true);
  const handleCreateCompetenceClose = () => setOpenCreateCompetence(false);

  const [openEditCompetence, setOpenEditCompetence] = useState(false);
  const handleEditCompetenceOpen = () => setOpenEditCompetence(true);
  const handleEditCompetenceClose = () => setOpenEditCompetence(false);

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
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Competence</Typography>;
        },
        accessor: 'Name', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Assigned Role</Typography>;
        },
        accessor: 'FK_AssignedRole', // eslint-disable-next-line
        Cell: ({ value }) => {
          let fullName = '';
          let initial = '';
          rolePositionList?.forEach((item) => {
            if (item?.id === value) {
              initial = item?.Initial;
              fullName = item?.RoleName;
            }
          });
          return (
            <Typography style={{ textAlign: 'center' }}>
              <b>{initial}</b>
              {fullName && ' - ' + fullName}
            </Typography>
          );
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>Required Rate</Typography>;
        },
        accessor: 'Rate', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
        }
      },
      {
        Header: () => {
          return <Typography style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>SOLL</Typography>;
        },
        accessor: 'SOLL', // eslint-disable-next-line
        Cell: ({ value }) => {
          return <Typography style={{ textAlign: 'center' }}>{value}</Typography>;
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
                  competenceList?.forEach((item) => {
                    if (item?.id === value) {
                      setCurCompetence(item);
                    }
                  });
                  handleEditCompetenceOpen();
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  setCurCompetenceID(value);
                  handleDeleteCompetenceOpen();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }
      }
    ],
    [competenceList, rolePositionList]
  );

  const makeCompetenceList = (data) => {
    let tmpArr = [];
    data?.forEach((item, idx) => {
      tmpArr.push({
        idx: idx + 1,
        Name: item.Name,
        FK_AssignedRole: item.FK_AssignedRole,
        Rate: item?.Rate,
        SOLL: item?.SOLL,
        id: item?.id
      });
    });
    setCompetenceList(tmpArr);
  };

  const handleDeleteCompetence = async () => {
    const res = await deleteCompetence(curCompetenceID);
    if (res?.status) {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Success to delete competence',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
      handleDeleteCompetenceClose();
      makeCompetenceList(res?.data);
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

  useEffect(() => {
    getDepartmentList().then((departmentData) => {
      if (departmentData?.length > 0) {
        setCurDepartment(departmentData[0]?.id);
      }
      setDepartmentList(departmentData);
    });
    getRateTypes().then((rateTypeData) => {
      setRateTypes(rateTypeData);
    });
    getRolePositionList().then((rolePostionData) => {
      setRolePositionList(rolePostionData);
    });
  }, [getDepartmentList, getRateTypes, getRolePositionList]);

  useEffect(() => {
    if (curDepartment) {
      setLoading(true);
      setCompetenceList([]);
      getCompetenceList(curDepartment).then((competenceData) => {
        setLoading(false);
        makeCompetenceList(competenceData);
      });
    }
  }, [getCompetenceList, curDepartment]);

  return (
    <>
      {loading && <Loader />}
      <MainCard title="Department & Competence List" sx={{ width: '100%' }}>
        <Grid container spacing={2} display="flex" alignItems="center">
          <Grid item>
            <Typography>Department</Typography>
          </Grid>
          <Grid item>
            <Select
              value={curDepartment}
              onChange={(e) => {
                setCurDepartment(e.target.value);
              }}
              sx={{ width: 300 }}
            >
              {departmentList?.map((department, idx) => {
                return (
                  <MenuItem key={'department_name_' + idx} value={department?.id}>
                    {department?.Title}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button variant="contained" onClick={handleCreateCompetenceOpen}>
              Add New Competence
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ReactTable columns={columns} data={competenceList} getHeaderProps={(column) => column.getSortByToggleProps()} />
          </Grid>
        </Grid>
      </MainCard>
      <Modal
        open={openDeleteCompetence}
        onClose={handleDeleteCompetenceClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MainCard title="Delete Competence" modal darkTitle content={false} sx={{ width: { xs: '90%', md: '640px' } }}>
          <CardContent>
            <Typography gutterBottom>Do you want to delete this competence?</Typography>
          </CardContent>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
            <Button color="error" onClick={handleDeleteCompetenceClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDeleteCompetence}>
              Yes
            </Button>
          </Stack>
        </MainCard>
      </Modal>
      <Modal
        open={openCreateCompetence}
        onClose={handleCreateCompetenceClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          enableReinitialize
          initialValues={{
            Name: '',
            FK_AssignedRole: '',
            Rate: '',
            FK_Department: curDepartment,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            Name: Yup.string()
              .nullable()
              .max(255, 'Competence name length should be less than 255')
              .required('Competence name is required'),
            FK_AssignedRole: Yup.number().integer().min(1).nullable().required('Assigned role is required'),
            Rate: Yup.string().nullable().required('Rate is required')
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            const res = await createCompetence(values);
            if (res.status === true) {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Success to create a competence',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    }
                  })
                );
              }
              makeCompetenceList(res.data);
              handleCreateCompetenceClose();
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
                title="Create Competence"
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
                    <Grid item xs={12}>
                      <Typography>Competence Name</Typography>
                      <TextField fullWidth name="Name" value={values.Name} onBlur={handleBlur} onChange={handleChange} />
                      {touched.Name && errors.Name && (
                        <FormHelperText error id="helper-text-Name-competence">
                          {errors.Name}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Assigned Role</Typography>
                      <Select fullWidth name="FK_AssignedRole" value={values.FK_AssignedRole} onBlur={handleBlur} onChange={handleChange}>
                        {rolePositionList?.map((rolePostion, idx) => {
                          return (
                            <MenuItem key={'rolePostion_' + idx} value={rolePostion?.id}>
                              <b>{rolePostion?.Initial}</b> - {rolePostion?.RoleName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.FK_AssignedRole && errors.FK_AssignedRole && (
                        <FormHelperText error id="helper-text-FK_AssignedRole-competence">
                          {errors.FK_AssignedRole}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Required Rate</Typography>
                      <Select fullWidth name="Rate" value={values.Rate} onBlur={handleBlur} onChange={handleChange}>
                        {rateTypes?.map((rate_type, idx) => {
                          return (
                            <MenuItem key={'rate_type_' + idx} value={rate_type?.RateType}>
                              {rate_type?.RateType}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.Rate && errors.Rate && (
                        <FormHelperText error id="helper-text-Rate-competence">
                          {errors.Rate}
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
        open={openEditCompetence}
        onClose={handleEditCompetenceClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          enableReinitialize
          initialValues={{
            Name: curCompetence?.Name,
            FK_AssignedRole: curCompetence?.FK_AssignedRole,
            Rate: curCompetence?.Rate,
            FK_Department: curDepartment,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            Name: Yup.string()
              .nullable()
              .max(255, 'Competence name length should be less than 255')
              .required('Competence name is required'),
            FK_AssignedRole: Yup.number().integer().min(1).nullable().required('Assigned role is required'),
            Rate: Yup.string().nullable().required('Rate is required')
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            const res = await updateCompetence(curCompetence?.id, values);
            if (res.status === true) {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Success to update a competence',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    }
                  })
                );
              }
              makeCompetenceList(res.data);
              handleEditCompetenceClose();
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
                title="Edit Competence"
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
                    <Grid item xs={12}>
                      <Typography>Competence Name</Typography>
                      <TextField fullWidth name="Name" value={values.Name} onBlur={handleBlur} onChange={handleChange} />
                      {touched.Name && errors.Name && (
                        <FormHelperText error id="helper-text-Name-competence">
                          {errors.Name}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Assigned Role</Typography>
                      <Select fullWidth name="FK_AssignedRole" value={values.FK_AssignedRole} onBlur={handleBlur} onChange={handleChange}>
                        {rolePositionList?.map((rolePostion, idx) => {
                          return (
                            <MenuItem key={'rolePostion_' + idx} value={rolePostion?.id}>
                              <b>{rolePostion?.Initial}</b> - {rolePostion?.RoleName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.FK_AssignedRole && errors.FK_AssignedRole && (
                        <FormHelperText error id="helper-text-FK_AssignedRole-competence">
                          {errors.FK_AssignedRole}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Required Rate</Typography>
                      <Select fullWidth name="Rate" value={values.Rate} onBlur={handleBlur} onChange={handleChange}>
                        {rateTypes?.map((rate_type, idx) => {
                          return (
                            <MenuItem key={'rate_type_' + idx} value={rate_type?.RateType}>
                              {rate_type?.RateType}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.Rate && errors.Rate && (
                        <FormHelperText error id="helper-text-Rate-competence">
                          {errors.Rate}
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
