import * as types from "../constants/actionTypes";

/******************************* actions for side bar ************************************/

export const renameComponent = event => dispatch => {
  let inputName = event.target.value;
  inputName = inputName.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
    return g1.toUpperCase() + g2.toLowerCase();
  });
  inputName = inputName.replace(/\s/g, "");

  dispatch({
    type: types.RENAME_COMPONENT,
    payload: {
      inputName
    }
  });
};

export const changeType = event => dispatch => {
  const isContainer = event.target.checked;

  dispatch({
    type: types.CHANGE_TYPE,
    payload: {
      isContainer
    }
  });
};

export const deleteComponent = () => dispatch => {
  dispatch({
    type: types.DELETE_COMPONENT,
    payload: null
  });
};

/******************************* actions for main container ************************************/

export const setCurrentComponent = (currentComponent, data) => dispatch => {
  if (document.getElementById("component-name-input")) {
    document.getElementById("component-name-input").value =
      currentComponent.name;
  }

  dispatch({
    type: types.SET_CURRENT_COMPONENT,
    payload: {
      currentComponent,
      data
    }
  });
};

export const setTransAndHistory = (translate, history) => dispatch => {
  dispatch({
    type: types.SET_TRANS_AND_HISTORY,
    payload: {
      translate,
      history
    }
  });
};

export const undo = () => dispatch => {
  dispatch({
    type: types.UN_DO,
    payload: null
  });
};

export const redo = () => dispatch => {
  dispatch({
    type: types.RE_DO,
    payload: null
  });
};

/*********************** actions for current component children list ****************************/
export const renameChild = (event, childId) => dispatch => {
  const inputName = event.target.value.replace(/\s/g, "");
  dispatch({
    type: types.RENAME_CHILD,
    payload: {
      inputName,
      childId
    }
  });
};

export const changeChildType = (event, childId) => dispatch => {
  const isChecked = event.target.checked;
  dispatch({
    type: types.CHANGE_CHILD_TYPE,
    payload: {
      isChecked,
      childId
    }
  });
};

export const addChild = event => dispatch => {
  event.preventDefault();
  let name = event.target.childName.value || "Component";
  name = name.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
    return g1.toUpperCase() + g2.toLowerCase();
  });
  name = name.replace(/\s/g, "");
  const isContainer = event.target.checkbox.checked;

  // reset the input fields
  document.getElementById("add-child-name").value = "";
  document.getElementById("add-child-container-checkbox").checked = false;

  dispatch({
    type: types.ADD_CHILD,
    payload: {
      name,
      isContainer
    }
  });
};

export const deleteChild = childId => dispatch => {
  dispatch({
    type: types.DELETE_CHILD,
    payload: {
      childId
    }
  });
};

// actions for taking the templates and sending it to the store
export const useTemplates = templates => dispatch => {
  dispatch({
    type: types.USE_TEMPLATES,
    payload: { templates }
  });
};

export const setTemplatesForComponent = (
  currentComponent,
  template
) => dispatch => {
  dispatch({
    type: types.SET_TEMPLATES_FOR_COMPONENT,
    payload: { currentComponent, template }
  });
};
export const changeDisplayHorizontalToVertical = orientation => dispatch => {
  dispatch({
    type: types.CHANGE_DISPLAY_HORIZONTAL_OR_VERTICAL,
    payload: orientation
  });
};
// export const setZoom = (x, y) => dispatch => {
//   dispatch({
//     type: types.ZOOM_BY_CHANGING_X_AND_Y,
//     payload: { x, y }
//   });
// };
export const updateStateWithLocalStorage = (
  data,
  currentComponent,
  nameAndCodeLinkedToComponentId,
  lastId
) => dispatch => {
  dispatch({
    type: types.UPDATE_STATE_WITH_LOCAL_STORAGE,
    payload: { data, currentComponent, nameAndCodeLinkedToComponentId, lastId }
  });
};

export const resetEntireTree = () => dispatch => {
  console.log("here inside of actions");
  dispatch({
    type: types.RESET_ENTIRE_TREE,
    payload: null
  });
};
