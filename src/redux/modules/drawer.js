const HIDE_DRAWER = 'HIDE_DRAWER';
const SHOW_SEARCH_DRAWER = 'SHOW_SEARCH_DRAWER';
const SHOW_MAP_DRAWER = 'SHOW_MAP_DRAWER';
const SHOW_INFO_DRAWER = 'SHOW_INFO_DRAWER';
const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';

export function showSearch() {
  return {
    type: SHOW_SEARCH_DRAWER,
  };
}

export function showMap() {
  return {
    type: SHOW_MAP_DRAWER,
  };
}

export function showInfo() {
  return {
    type: SHOW_INFO_DRAWER,
  };
}

export function hideDrawer() {
  return {
    type: HIDE_DRAWER,
  };
}

export function setSearchText(payload) {
  return {
    type: SET_SEARCH_TEXT,
    payload
  };
}

const initialState = {
  drawerType: null,
  searchText: "",
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case SHOW_SEARCH_DRAWER:
    return {
      ...state,
      drawerType: 'SEARCH',
    };

  case SET_SEARCH_TEXT:
    return {
      ...state,
      searchText: action.payload
    };

  case SHOW_MAP_DRAWER:
    return {
      ...state,
      drawerType: 'MAP',
    };

  case SHOW_INFO_DRAWER:
    return {
      ...state,
      drawerType: 'INFO',
    };

  case HIDE_DRAWER:
    return {
      ...state,
      drawerType: null,
    };

  default:
    return state;
  }
}
