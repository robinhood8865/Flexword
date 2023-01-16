import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
// import Loader from 'components/Loader';
import axios from 'utils/axios';
import jwtDecode from 'jwt-decode';

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }

  const decoded = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

import { UserType } from 'utils/constants';

// Flex HR actions
const GET_USER_TYPE = 'GET_USER_TYPE';

const initialState = {
  userType: UserType.NORMAL_USER
};

const FlexHRReducer = (state, action) => {
  switch (action.type) {
    case GET_USER_TYPE:
      return {
        ...state,
        userType: action.payload.userType
      };
    default:
      return state;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const FlexHRContext = createContext(null);

export const FlexHRProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FlexHRReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const response = await axios.get('/auth');
          const user = response.data;
          dispatch({
            type: GET_USER_TYPE,
            payload: {
              userType: user?.UserType
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  const getDepartmentList = useCallback(async () => {
    try {
      const res = await axios.get('/home/department');
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const getRateTypes = useCallback(async () => {
    try {
      const res = await axios.get('/home/ratetypes');
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const getSkillTypes = useCallback(async () => {
    try {
      const res = await axios.get('/home/skilltype');
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const getLevelColors = useCallback(async () => {
    try {
      const res = await axios.get('/home/levelcolor');
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const getSoll = useCallback(async () => {
    try {
      const res = await axios.get('/home/soll');
      return res.data.SOLL;
    } catch (err) {
      return '';
    }
  }, []);

  const setSoll = useCallback(async (SOLL) => {
    try {
      await axios.put('/home/soll', { SOLL });
      return true;
    } catch (err) {
      return err?.message;
    }
  }, []);

  const getCompetenceList = useCallback(async (id) => {
    try {
      const res = await axios.get(`/home/competence/${id}`);
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const deleteCompetence = useCallback(async (id) => {
    try {
      const res = await axios.delete(`/home/competence/${id}`);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const createCompetence = useCallback(async (values) => {
    try {
      const res = await axios.put('/home/competence', values);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const updateCompetence = useCallback(async (id, values) => {
    try {
      const res = await axios.post('/home/competence/' + id, values);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const getRolePositionList = useCallback(async () => {
    try {
      const res = await axios.get('/home/roleposition');
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const deleteRolePosition = useCallback(async (id) => {
    try {
      const res = await axios.delete(`/home/roleposition/${id}`);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const createRolePosition = useCallback(async (values) => {
    try {
      const res = await axios.put('/home/roleposition', values);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const updateRolePosition = useCallback(async (id, values) => {
    try {
      const res = await axios.post('/home/roleposition/' + id, values);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  const getAssignedSkillsByUsers = useCallback(async (id) => {
    try {
      const res = await axios.get('/home/skillassign/' + id);
      return res.data;
    } catch (err) {
      return [];
    }
  }, []);

  const setAssignedSkillsByUsers = useCallback(async (id, values) => {
    try {
      const res = await axios.put('/home/skillassign/' + id, values);
      return { status: true, data: res.data };
    } catch (err) {
      return { status: false, data: err.message };
    }
  }, []);

  return (
    <FlexHRContext.Provider
      value={{
        ...state,
        getDepartmentList,
        getRateTypes,
        getSkillTypes,
        getLevelColors,
        getSoll,
        setSoll,
        getCompetenceList,
        deleteCompetence,
        createCompetence,
        updateCompetence,
        getRolePositionList,
        deleteRolePosition,
        createRolePosition,
        updateRolePosition,
        getAssignedSkillsByUsers,
        setAssignedSkillsByUsers
      }}
    >
      {children}
    </FlexHRContext.Provider>
  );
};

FlexHRProvider.propTypes = {
  children: PropTypes.node
};

export default FlexHRContext;
