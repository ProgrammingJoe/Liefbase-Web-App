const HIDE_DRAWER = 'HIDE_DRAWER';
const SHOW_MAP_DRAWER = 'SHOW_MAP_DRAWER';

export const showMap = () => ({
  type: SHOW_MAP_DRAWER,
});

export const hideDrawer = () => ({
  type: HIDE_DRAWER,
});

const initialState = {
  drawerType: null,
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case HIDE_DRAWER:
    return initialState;

  case SHOW_MAP_DRAWER:
    return {
      ...state,
      drawerType: 'MAP',
    };
  }

  return state;
}
