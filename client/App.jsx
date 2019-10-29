import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setTransAndHistory,
  updateStateWithLocalStorage,
  undo,
  redo,
  setCurrentComponent,
  showSubTree
} from './actions/actions';
import clone from 'clone';
import TopNavContainer from './containers/TopNavContainer.jsx';
import PanelContainer from './containers/PanelContainer.jsx';
import VisualContainer from './containers/VisualContainer.jsx';
function DoublyLinkedList(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
}

const mapStateToProps = store => ({
  state: store.main,
  data: store.main.data,
  translate: store.main.translate,
  orientation: store.main.orientation,
  currentSubTreeDisplayToUser: store.main.currentSubTreeDisplayToUser,
  currentlyDisplayedSubTreeId: store.main.currentlyDisplayedSubTreeId
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateStateWithLocalStorage,
      setTransAndHistory,
      undo,
      redo,
      setCurrentComponent,
      showSubTree
    },
    dispatch
  );
const App = ({
  state,
  updateStateWithLocalStorage,
  setTransAndHistory,
  undo,
  redo,
  setCurrentComponent,
  data,
  translate,
  orientation,
  currentSubTreeDisplayToUser,
  showSubTree,
  currentlyDisplayedSubTreeId
}) => {
  useEffect(() => {
    let data = localStorage.getObj('data');
    if (data) {
      const nameAndCodeLinkedToComponentId = localStorage.getObj(
        'nameAndCodeLinkedToComponentId'
      );
      const currentComponent = localStorage.getObj('currentComponent');
      const lastId = localStorage.getObj('lastId');
      const history = localStorage.getObj('history');
      const displaySubTreeDropDown = localStorage.getObj(
        'displaySubTreeDropDown'
      );
      updateStateWithLocalStorage(
        data,
        currentComponent,
        nameAndCodeLinkedToComponentId,
        lastId,
        history,
        displaySubTreeDropDown
      );
    }
    const initialHistory = new DoublyLinkedList(clone(state));
    const domElementForVisualContainer = document.getElementById(
      'visual-container'
    );
    const dimensions = domElementForVisualContainer.getBoundingClientRect();
    setTransAndHistory(
      {
        x: dimensions.width / 2,
        y: dimensions.height / 6
      },
      initialHistory
    );
    showSubTree(currentlyDisplayedSubTreeId);
  }, []);
  return (
    <div id='application'>
      <TopNavContainer />
      <div id='panel-main-container'>
        <PanelContainer />
        <VisualContainer
          undo={undo}
          redo={redo}
          setCurrentComponent={setCurrentComponent}
          data={data}
          translate={translate}
          orientation={orientation}
          currentSubTreeDisplayToUser={currentSubTreeDisplayToUser}
          showSubTree={showSubTree}
          currentlyDisplayedSubTreeId={currentlyDisplayedSubTreeId}
        />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
