const SELECT_MAP = 'SELECT_MAP';

export const selectMap = (payload) => ({
  type: SELECT_MAP,
  payload,
});

const initialState = {
  selectedMapId: undefined,
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case SELECT_MAP:
    return {
      ...state,
      selectedMapId: action.payload.id,
    };
  }

  return state;
}
