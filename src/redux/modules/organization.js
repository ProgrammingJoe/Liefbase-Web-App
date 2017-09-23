import { getOrganizations as getOrganizationsAPI } from '../../api';

const pending = 'ORGANIZATIONS/PENDING';
const success = 'ORGANIZATIONS/SUCCESS';
const error = 'ORGANIZATIONS/ERROR';

const requestPending = () => ({
  type: pending,
});

const requestSuccess = (payload) => ({
  type: success,
  payload,
});

const requestError = () => ({
  type: error,
});

export const getOrganizations = () => (dispatch) => {
  dispatch(requestPending());
  return getOrganizationsAPI()
    .then(response => {
      dispatch(requestSuccess(response.data));
    })
    .catch(err => {
      console.error("error fetching organizations: ", err);
      dispatch(requestError('Error fetching organizations'));
    });
};

const initialState = {
  pending: false,
  error: false,
  organizations: [],
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case success:
    return {
      ...state,
      pending: false,
      error: false,
      organizations: action.payload,
    };

  case pending:
    return {
      ...state,
      pending: true,
      error: false,
    };

  case error:
    return {
      ...state,
      pending: false,
      error: true,
    };

  default:
    return state;
  }
}
