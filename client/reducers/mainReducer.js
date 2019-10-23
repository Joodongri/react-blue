import * as types from '../constants/actionTypes';
import clone from 'clone';
import {
  deleteChildrenInNameAndCodeLinkedToComponentId,
  findAndDeleteInCurrentComponent
} from './utils/deleteNodeFuncs';
import { easterEgg } from './utils/easterEgg'
import { updateTree, DoublyLinkedList } from './utils/updateTree'

const appComponent = {
  name: 'App',
  depth: 0,
  id: 0,
  componentId: 0,
  isContainer: true,
  children: []
};

const initialState = {
  data: appComponent,
  translate: { x: 0, y: 0 },
  history: null,
  currentComponent: appComponent,
  nameAndCodeLinkedToComponentId: {},
  lastId: 0,
  defaultNameCount: 0,
  templates: [],
  orientation: 'vertical',
  toggleFileTree: true,
  recentTimeoutId: 0
};

const mainReducer = (state = initialState, action) => {
  let isContainer,
    currentComponent,
    childId,
    children,
    data,
    inputName,
    translate,
    templates,
    updatedState,
    history,
    nameAndCodeLinkedToComponentId,
    lastId;
  switch (action.type) {
    /******************************* actions for side bar ************************************/
    case types.RENAME_COMPONENT:
      inputName = action.payload.inputName;
      currentComponent = clone(state.currentComponent);
      currentComponent.name = inputName;
      updatedState = updateTree(state, currentComponent);

      return {
        ...state,
        ...updatedState
      };

    case types.CHANGE_TYPE:
      isContainer = action.payload.isContainer;
      currentComponent = clone(state.currentComponent);
      currentComponent.isContainer = isContainer;
      updatedState = updateTree(state, currentComponent);

      return {
        ...state,
        ...updatedState
      };

    case types.DELETE_COMPONENT:
      if (state.currentComponent.depth === 0) {
        alert("Error: can't delete root component.");
        return {
          ...state
        };
      }
      //grabbing props from state to clone and mututate
      const parent = Object.assign({}, state.currentComponent.parent);
      data = clone(state.data);
      currentComponent = clone(state.currentComponent);
      nameAndCodeLinkedToComponentId = clone(state.nameAndCodeLinkedToComponentId);
      nameAndCodeLinkedToComponentId = deleteChildrenInNameAndCodeLinkedToComponentId(currentComponent, nameAndCodeLinkedToComponentId)
      findAndDeleteInCurrentComponent(data, currentComponent, parent);

      let preHistory = state.history;
      history = new DoublyLinkedList(
        clone({
          data,
          currentComponent: parent,
          nameAndCodeLinkedToComponentId,
          lastId: state.lastId,
          defaultNameCount: state.defaultNameCount
        })
      );
      preHistory.next = history;
      history.prev = preHistory;
      return {
        ...state,
        data,
        currentComponent: parent,
        nameAndCodeLinkedToComponentId,
        history
      };

    /******************************* actions for main container ************************************/

    case types.SET_CURRENT_COMPONENT:
      currentComponent = action.payload.currentComponent;
      return {
        ...state,
        currentComponent
      };

    case types.SET_TRANS_AND_HISTORY:
      translate = action.payload.translate;
      history = action.payload.history;
      return {
        ...state,
        translate,
        history
      };
      
    case types.UN_DO:
      if (state.history.prev) {
        history = clone(state.history.prev);
        data = clone(history.value.data);
        translate = clone(history.value.translate);
        currentComponent = clone(history.value.currentComponent);
        nameAndCodeLinkedToComponentId = clone(
          history.value.nameAndCodeLinkedToComponentId
        );
        lastId = history.value.lastId;
        defaultNameCount = history.value.defaultNameCount;
        templates = clone(history.value.templates);
        return {
          ...state,
          data,
          translate,
          history,
          currentComponent,
          nameAndCodeLinkedToComponentId,
          lastId,
          defaultNameCount,
          templates
        };
      } else {
        return {
          ...state
        };
      }

    case types.RE_DO:
      if (state.history.next) {
        history = clone(state.history.next);
        data = clone(history.value.data);
        translate = clone(history.value.translate);
        currentComponent = clone(history.value.currentComponent);
        nameAndCodeLinkedToComponentId = clone(
          history.value.nameAndCodeLinkedToComponentId
        );
        lastId = history.value.lastId;
        defaultNameCount = history.value.defaultNameCount;
        templates = clone(history.value.templates);
        return {
          ...state,
          data,
          translate,
          history,
          currentComponent,
          nameAndCodeLinkedToComponentId,
          lastId,
          defaultNameCount,
          templates
        };
      } else {
        return {
          ...state
        };
      }

    /*********************** actions for current component children list ****************************/

    case types.RENAME_CHILD:
      inputName = action.payload.inputName;
      childId = action.payload.childId;
      children = state.currentComponent.children.slice();
      for (let child of children) {
        if (child.componentId === childId) {
          child.name = inputName;
        }
      }

      currentComponent = clone(state.currentComponent);
      currentComponent.children = children;
      updatedState = updateTree(state, currentComponent);
      return {
        ...state,
        ...updatedState
      };

    case types.CHANGE_CHILD_TYPE:
      isContainer = action.payload.isChecked;
      childId = action.payload.childId;
      children = clone(state.currentComponent.children);
      for (let child of children) {
        if (child.componentId === childId) {
          child.isContainer = isContainer;
        }
      }
      currentComponent = clone(state.currentComponent);
      currentComponent.children = children;
      updatedState = updateTree(state, currentComponent);

      return {
        ...state,
        ...updatedState
      };

    case types.ADD_CHILD:
      let name, defaultNameCount;
      if (action.payload.name) {
        name = action.payload.name;
        if (name === 'Sandstorm') {
          easterEgg()
        }
      } else {
        defaultNameCount = state.defaultNameCount + 1;
        name = `Component${defaultNameCount}`;
      }

      isContainer = action.payload.isContainer;
      const componentId = state.lastId + 1;
      const newChild = {
        name,
        componentId,
        isContainer,
        parent: state.currentComponent
      };
      
      children = state.currentComponent.children
        ? state.currentComponent.children.slice()
        : [];
      children.push(newChild);
      currentComponent = clone(state.currentComponent);
      currentComponent.children = children.slice();   
      updatedState = updateTree(state, currentComponent);
      nameAndCodeLinkedToComponentId = clone(
        state.nameAndCodeLinkedToComponentId
      );
      nameAndCodeLinkedToComponentId[componentId] = state.templates[0];
      updatedState.history.value.nameAndCodeLinkedToComponentId[componentId] =
        state.templates[0];

      return {
        ...state,
        ...updatedState,
        nameAndCodeLinkedToComponentId,
        lastId: componentId,
        defaultNameCount: defaultNameCount
          ? defaultNameCount
          : state.defaultNameCount
      };

    case types.DELETE_CHILD:
      childId = action.payload.childId;
      currentComponent = clone(state.currentComponent);

      for (let i = 0; i < currentComponent.children.length; i++) {
        if (currentComponent.children[i].componentId === childId) {
          const [tempNode] = currentComponent.children.splice(i, 1);
          nameAndCodeLinkedToComponentId = clone(
            state.nameAndCodeLinkedToComponentId
          );
          delete nameAndCodeLinkedToComponentId[childId];
          if (tempNode.children && tempNode.children.length > 0) {
            nameAndCodeLinkedToComponentId = deleteChildrenInNameAndCodeLinkedToComponentId(
              tempNode.children,
              nameAndCodeLinkedToComponentId
            );
          }
        }
      }

      updatedState = updateTree(state, currentComponent);
      return {
        ...state,
        ...updatedState,
        nameAndCodeLinkedToComponentId
      };

    case types.USE_TEMPLATES:
      let templates = [...action.payload.templates];
      nameAndCodeLinkedToComponentId = clone(
        state.nameAndCodeLinkedToComponentId
      );
      if (!nameAndCodeLinkedToComponentId['0']) {
        nameAndCodeLinkedToComponentId['0'] = templates[0];
      }
      return {
        ...state,
        nameAndCodeLinkedToComponentId,
        templates
      };

    case types.SET_TEMPLATES_FOR_COMPONENT:
      nameAndCodeLinkedToComponentId = clone(
        state.nameAndCodeLinkedToComponentId
      );
      nameAndCodeLinkedToComponentId[
        action.payload.currentComponent.componentId
      ] = action.payload.template;
      history = clone(state.history);
      history.value.nameAndCodeLinkedToComponentId[
        action.payload.currentComponent.componentId
      ] = action.payload.template;
      return {
        ...state,
        history,
        nameAndCodeLinkedToComponentId
      };

    case types.ZOOM_BY_CHANGING_X_AND_Y:
      translate = Object.assign({}, state.translate);
      translate.x += action.payload.x;
      translate.y += action.payload.y;
      return {
        ...state,
        translate
      };

    case types.CHANGE_DISPLAY_HORIZONTAL_OR_VERTICAL:
      return {
        ...state,
        orientation: action.payload
      };

    case types.UPDATE_STATE_WITH_LOCAL_STORAGE:
      data = action.payload.data;
      currentComponent = action.payload.currentComponent;
      nameAndCodeLinkedToComponentId =
        action.payload.nameAndCodeLinkedToComponentId;
      lastId = action.payload.lastId;
      history = action.payload.history
      history.prev = null;
      defaultNameCount = lastId - 1;
      return {
        ...state,
        data,
        currentComponent,
        nameAndCodeLinkedToComponentId,
        lastId,
        history,
        defaultNameCount
      };

    case types.RESET_ENTIRE_TREE:
      localStorage.clear();
      location.reload(true);
      return {
        ...state
      };

    // file tree toggle
    case types.SHOW_FILE_TREE:
      const newToggleFileTree = state.toggleFileTree;

      return {
        ...state,
        toggleFileTree: !newToggleFileTree
      };

    case types.SET_TIMEOUT_ID:
      return {
        ...state,
        recentTimeoutId: action.payload
      }

    default:
      return state;
  }
};

export default mainReducer;
