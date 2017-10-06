const HIDE_DRAWER = 'HIDE_DRAWER';
const SHOW_DRAWER = 'SHOW_DRAWER';

export const drawerTypes = [
  'maps',
  'organizations',
  'teams',
  'settings',
];

export const showDrawer = drawer => ({
  type: SHOW_DRAWER,
  drawer,
});

export const hideDrawer = () => ({
  type: HIDE_DRAWER,
});

const initialState = {
  activeDrawer: null,
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case HIDE_DRAWER:
    return initialState;

  case SHOW_DRAWER:
    return {
      ...state,
      activeDrawer: action.drawer,
    };
  }

  return state;
}
