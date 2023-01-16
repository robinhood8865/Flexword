import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  CardContent,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';
import useScriptRef from 'hooks/useScriptRef';

import Loader from 'components/Loader';

import useFlexHR from 'hooks/useFlexHR';

export default function CompetenceManagement() {
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();

  const { getDepartmentList, getCompetenceList, getAssignedSkillsByUsers, getLevelColors, getSkillTypes, setAssignedSkillsByUsers } =
    useFlexHR();

  const [levelColors, setLevelColors] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [curDepartment, setCurDepartment] = useState(0);
  const [competenceList, setCompetenceList] = useState([]);
  const [curCompetence, setCurCompetence] = useState(0);
  const [users, setUsers] = useState([]);

  const [filterDepartmentList, setFilterDepartmentList] = useState([]);
  const [filterFirstRoleList, setFilterFirstRoleList] = useState([]);
  const [filterSecondRoleList, setFilterSecondRoleList] = useState([]);

  const [idxPattern, setIdxPattern] = useState('');
  const [firstNamePattern, setFirstNamePattern] = useState('');
  const [namePattern, setNamePattern] = useState('');
  const [sitePattern, setSitePattern] = useState('');
  const [departmentPattern, setDepartmentPattern] = useState('All');
  const [firstRolePattern, setFirstRolePattern] = useState('All');
  const [secondRolePattern, setSecondRolePattern] = useState('All');
  const [commentPattern, setCommentPattern] = useState('');
  const [skillPattern, setSkillPattern] = useState(-1);
  const [levelPattern, setLevelPattern] = useState(-1);

  const [loading, setLoading] = useState(false);

  const [invalidUserInfo, setInvalidUserInfo] = useState('');
  const [invalidType, setInvalidType] = useState(0);
  const [openSkillValidation, setOpenSkillValidation] = useState(false);
  const handleSkillValidationOpen = () => setOpenSkillValidation(true);
  const handleSkillValidationClose = () => setOpenSkillValidation(false);

  const makeUsers = (data) => {
    let tmpArr = [];
    let tmpFilterDepartmentList = [];
    let tmpFilterFirstRoleList = [];
    let tmpFilterSecondRoleList = [];
    data?.forEach((item, idx) => {
      let tmp = item;
      tmp.idx = idx + 1;
      tmpArr.push(tmp);
      if (tmpFilterDepartmentList.indexOf(item?.Department) === -1) tmpFilterDepartmentList.push(item?.Department);
      if (tmpFilterFirstRoleList.indexOf(item?.Role1) === -1) tmpFilterFirstRoleList.push(item?.Role1);
      if (tmpFilterSecondRoleList.indexOf(item?.Role2) === -1) tmpFilterSecondRoleList.push(item?.Role2);
    });
    setUsers(tmpArr);
    setFilterDepartmentList(tmpFilterDepartmentList);
    setFilterFirstRoleList(tmpFilterFirstRoleList);
    setFilterSecondRoleList(tmpFilterSecondRoleList);
  };

  useEffect(() => {
    getLevelColors().then((colors) => {
      setLevelColors(colors);
    });
    getSkillTypes().then((skills) => {
      setSkillTypes(skills);
    });
    getDepartmentList().then((departmentData) => {
      setDepartmentList(departmentData);
      if (departmentData?.length > 0) {
        setCurDepartment(departmentData[0]?.id);
      }
    });
  }, [getLevelColors, getSkillTypes, getDepartmentList]);

  useEffect(() => {
    if (curDepartment) {
      getCompetenceList(curDepartment).then((competenceData) => {
        setCompetenceList(competenceData);
        if (competenceData?.length > 0) {
          setCurCompetence(competenceData[0]?.id);
        }
      });
    }
  }, [getCompetenceList, curDepartment]);

  useEffect(() => {
    if (curCompetence) {
      setUsers([]);
      setLoading(true);
      getAssignedSkillsByUsers(curCompetence).then((userData) => {
        setLoading(false);
        makeUsers(userData);
      });
    }
  }, [getAssignedSkillsByUsers, curCompetence]);

  const getColor = (colorID) => {
    let retColor = '';
    levelColors?.forEach((color) => {
      if (color?.id === colorID) retColor = color?.Color;
    });
    return retColor;
  };

  const getSkill = (skillID) => {
    let retSkill = '';
    skillTypes?.forEach((skill) => {
      if (skill?.id === skillID) retSkill = skill?.Type;
    });
    return retSkill;
  };

  const changeSkill = (userID, skill) => {
    let tmpUsers = [...users];
    tmpUsers?.forEach((user) => {
      if (user?.id === userID) user.SkillType = skill === 0 ? null : parseInt(skill);
    });
    setUsers(tmpUsers);
  };

  const changeColor = (userID, color) => {
    let tmpUsers = [...users];
    tmpUsers?.forEach((user) => {
      if (user?.id === userID) user.LevelColor = color === 0 ? null : parseInt(color);
    });
    setUsers(tmpUsers);
  };

  const saveCompetenceEmployees = async () => {
    for (const idx in users) {
      if (!!users[idx]?.SkillType && !users[idx]?.LevelColor) {
        setInvalidType(1);
        setInvalidUserInfo(users[idx]?.FirstName + ' ' + users[idx]?.Name + '(#' + (parseInt(idx) + 1) + ')');
        handleSkillValidationOpen();
        return;
      }
      if (!users[idx]?.SkillType && !!users[idx]?.LevelColor) {
        setInvalidType(2);
        setInvalidUserInfo(users[idx]?.FirstName + ' ' + users[idx]?.Name + '(#' + (parseInt(idx) + 1) + ')');
        handleSkillValidationOpen();
        return;
      }
    }

    let values = [];
    users?.forEach((user) => {
      if (!!user?.SkillType && !!user?.LevelColor)
        values.push({ FK_User: user?.id, SkillType: user?.SkillType, LevelColor: user?.LevelColor });
    });
    const res = await setAssignedSkillsByUsers(curCompetence, values);
    if (res?.status) {
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Success to save competence employees',
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
      }
      makeUsers(res?.data);
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

  return (
    <>
      {loading && <Loader />}
      <MainCard title="Select Department & Competence" sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography sx={{ width: 120 }}>Department List</Typography>
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
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography sx={{ width: 120 }}>Competence List</Typography>
            <Select
              value={curCompetence}
              onChange={(e) => {
                setCurCompetence(e.target.value);
              }}
              sx={{ width: 740 }}
            >
              {competenceList?.map((competence, idx) => {
                return (
                  <MenuItem key={'competence_name_' + idx} value={competence?.id}>
                    {competence?.Name}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard
        title="Competence Employees"
        sx={{ width: '100%', mt: 3 }}
        secondary={
          <Button variant="contained" onClick={saveCompetenceEmployees}>
            Save
          </Button>
        }
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>#</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>First Name</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Last Name</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Site</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Department</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Position / Role 1</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Position / Role 2</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Comment</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Skill / Level</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <TextField
                    sx={{ width: 40, '& .MuiOutlinedInput-input': { p: 0.5, textAlign: 'center' } }}
                    value={idxPattern}
                    onChange={(e) => setIdxPattern(e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <TextField
                    sx={{ width: 'fit-content', '& .MuiOutlinedInput-input': { p: 0.5, textAlign: 'center' } }}
                    value={firstNamePattern}
                    onChange={(e) => setFirstNamePattern(e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <TextField
                    sx={{ width: 'fit-content', '& .MuiOutlinedInput-input': { p: 0.5, textAlign: 'center' } }}
                    value={namePattern}
                    onChange={(e) => setNamePattern(e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <TextField
                    sx={{ width: 'fit-content', '& .MuiOutlinedInput-input': { p: 0.5, textAlign: 'center' } }}
                    value={sitePattern}
                    onChange={(e) => setSitePattern(e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <Select
                    fullWidth
                    sx={{ '& .MuiSelect-outlined': { p: 0.5 } }}
                    value={departmentPattern}
                    onChange={(e) => setDepartmentPattern(e.target.value)}
                  >
                    <MenuItem key={'filter_department_0'} value={'All'}>
                      All
                    </MenuItem>
                    {filterDepartmentList?.sort()?.map((department, idx) => {
                      return (
                        <MenuItem key={'filter_department_' + idx} value={department}>
                          {department}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <Select
                    fullWidth
                    sx={{ '& .MuiSelect-outlined': { p: 0.5 } }}
                    value={firstRolePattern}
                    onChange={(e) => setFirstRolePattern(e.target.value)}
                  >
                    <MenuItem key={'filter_first_role_0'} value={'All'}>
                      All
                    </MenuItem>
                    {filterFirstRoleList?.sort()?.map((role, idx) => {
                      return (
                        <MenuItem key={'filter_first_role_' + idx} value={role}>
                          {role}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <Select
                    fullWidth
                    sx={{ '& .MuiSelect-outlined': { p: 0.5 } }}
                    value={secondRolePattern}
                    onChange={(e) => setSecondRolePattern(e.target.value)}
                  >
                    <MenuItem key={'filter_first_role_0'} value={'All'}>
                      All
                    </MenuItem>
                    {filterSecondRoleList?.sort()?.map((role, idx) => {
                      return (
                        <MenuItem key={'filter_first_role_' + idx} value={role}>
                          {role}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <TextField
                    sx={{ width: 'fit-content', '& .MuiOutlinedInput-input': { p: 0.5, textAlign: 'center' } }}
                    value={commentPattern}
                    onChange={(e) => setCommentPattern(e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Select
                      sx={{ width: 80, '& .MuiSelect-outlined': { p: 0.5 }, mr: 1 }}
                      value={skillPattern}
                      onChange={(e) => setSkillPattern(e.target.value)}
                    >
                      <MenuItem key={'filter_skill_0_0'} value={-1}>
                        All
                      </MenuItem>
                      <MenuItem key={'filter_skill_0'} value={0}>
                        None
                      </MenuItem>
                      {skillTypes?.map((skill, idx) => {
                        return (
                          <MenuItem key={'filter_skill_' + idx} value={skill?.id}>
                            {skill?.Type}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <Select
                      sx={{ width: 80, '& .MuiSelect-outlined': { p: 0.5 } }}
                      value={levelPattern}
                      onChange={(e) => setLevelPattern(e.target.value)}
                    >
                      <MenuItem key={'filter_color_0_0'} value={-1}>
                        All
                      </MenuItem>
                      <MenuItem key={'filter_color_0'} value={0}>
                        None
                      </MenuItem>
                      {levelColors?.map((color, idx) => {
                        return (
                          <MenuItem key={'filter_color_' + idx} value={color?.id}>
                            <Box sx={{ background: color?.Color, width: '100%', textAlign: 'center' }}>{color?.Level}</Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIdxPattern('');
                      setFirstNamePattern('');
                      setNamePattern('');
                      setSitePattern('');
                      setDepartmentPattern('All');
                      setFirstRolePattern('All');
                      setSecondRolePattern('All');
                      setCommentPattern('');
                      setSkillPattern(-1);
                      setLevelPattern(-1);
                    }}
                  >
                    Clear Filter
                  </Button>
                </TableCell>
              </TableRow>
              {users?.map((user, idx) => {
                return (
                  <TableRow key={'competence_employee_' + idx}>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.idx}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.FirstName}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Name}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Site}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Department}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Role1}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Role2}</TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>{user?.Comment}</TableCell>
                    <TableCell sx={{ background: getColor(user?.LevelColor), textAlign: 'center', p: 0.5 }}>
                      {getSkill(user?.SkillType)}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', p: 0.5 }}>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Select
                          sx={{ width: 80, '& .MuiSelect-outlined': { p: 0.5 }, mr: 1 }}
                          value={user?.SkillType || 0}
                          onChange={(e) => changeSkill(user?.id, e.target.value)}
                        >
                          <MenuItem key={'skill_' + idx + '_0'} value={0}>
                            None
                          </MenuItem>
                          {skillTypes?.map((skill, skillIdx) => {
                            return (
                              <MenuItem key={'skill_' + idx + '_' + skillIdx} value={skill?.id}>
                                {skill?.Type}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <Select
                          sx={{ width: 80, '& .MuiSelect-outlined': { p: 0.5 } }}
                          value={user?.LevelColor || 0}
                          onChange={(e) => changeColor(user?.id, e.target.value)}
                        >
                          <MenuItem key={'color_' + idx + '_0'} value={0}>
                            None
                          </MenuItem>
                          {levelColors?.map((color, colorIdx) => {
                            return (
                              <MenuItem key={'color_' + idx + '_' + colorIdx} value={color?.id}>
                                <Box sx={{ background: color?.Color, width: '100%', textAlign: 'center' }}>{color?.Level}</Box>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                    Nothing to show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
      <Modal
        open={openSkillValidation}
        onClose={handleSkillValidationClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MainCard title="Alert" modal darkTitle content={false} sx={{ width: { xs: '90%', md: '640px' } }}>
          <CardContent>
            {invalidType === 1 && (
              <Typography>
                The skill has been set for <b>{invalidUserInfo}</b> but no level has been set.
              </Typography>
            )}
            {invalidType === 2 && (
              <Typography>
                The level has been set for <b>{invalidUserInfo}</b> but no skill has been set.
              </Typography>
            )}
          </CardContent>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
            <Button color="error" onClick={handleSkillValidationClose}>
              Close
            </Button>
          </Stack>
        </MainCard>
      </Modal>
    </>
  );
}
