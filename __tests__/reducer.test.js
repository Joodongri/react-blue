import mainReducer from '../client/reducers/mainReducer';
import {
    initialStateMock,
    currentStateMock,
    nextStateMock,
} from '../__mock__/stateMocks';
import * as types from '../client/constants/actionTypes';
import clone from 'clone';
window.alert = jest.fn();

describe('validation of main reducer', () => {
    it('should return the initial state when the action is not found', () => {
        expect(mainReducer(initialStateMock, {
            type: "NO_SUCH_ACTION"
        })).toEqual(initialStateMock);
    });
});

describe("Test Component Actions", () => {
    describe('renameComponent', () => {
        const renameComponentState = mainReducer(initialStateMock, {
            type: types.RENAME_COMPONENT,
            payload: {
                inputName: 'Test'
            }
        })
        it('should return the state with new current component name "Test"', () => {
            expect(renameComponentState.currentComponent.name).toEqual('Test');
        });
        it('should mutate data tree with new input name', () => {
            expect(renameComponentState.data.name).toEqual('Test');
        });
    });

    describe('changeType', () => {
        const changeTypeState = mainReducer(initialStateMock, {
            type: types.CHANGE_TYPE,
            payload: {
                isContainer: false
            }
        })
        it('should return the state with current component is not container', () => {
            expect(changeTypeState.currentComponent.isContainer).toEqual(false);
        });
        it('should mutate data tree with container type', () => {
            expect(changeTypeState.data.isContainer).toEqual(false);
        });
    });

    describe('deleteComponent', () => {
        const cloneNextStateMock = clone(nextStateMock);
        const deleteComponentState = mainReducer(cloneNextStateMock, {
            type: types.DELETE_COMPONENT
        });
        it('should return state with data that has only one child ', () => {
            expect(deleteComponentState.data.children).toHaveLength(1);
        });
        it('should delete the correct child component and reset the index of children array', () => {
            expect(deleteComponentState.data.children[0].name).toEqual('childComponent2');
        });
        it('should have current component that assigned by the parent of the deleted component', () => {
            expect(deleteComponentState.currentComponent.componentId).toEqual(0);
        });
        const deleteRootComponentState = mainReducer(initialStateMock, {
            type: types.DELETE_COMPONENT
        })
        it('should not be able to delete root component', () => {
            window.alert.mockClear();
            expect(deleteRootComponentState.currentComponent).toEqual(initialStateMock.currentComponent);
        });
    });
});

describe("Test Visual Container Actions", () => {
    describe('setCurrentComponent', () => {
        const setCurrentComponentState = mainReducer(nextStateMock, {
            type: types.SET_CURRENT_COMPONENT,
            payload: {
                currentComponent: {
                    name: "CurrentComponentTest",
                    depth: 1,
                    id: 3,
                    componentId: 2,
                    parent: {},
                    isContainer: false,
                    children: []
                }
            }
        });
        it('should return state with current component named "CurrentComponentTest"', () => {
            expect(setCurrentComponentState.currentComponent.name).toEqual("CurrentComponentTest");
        });
        it('should have not mutated original data', () => {
            expect(setCurrentComponentState.data).toEqual(nextStateMock.data);
        });
    });

    describe('setTransAndHistory', () => {
        const setTransAndHistoryState = mainReducer(initialStateMock, {
            type: types.SET_TRANS_AND_HISTORY,
            payload: {
                translate: {x: 100, y: 100},
                history: currentStateMock.history
            }
        });
        it('should set the translate of initial state to x:100 and y:100', () => {
            expect(setTransAndHistoryState.translate.x).toBe(100);
            expect(setTransAndHistoryState.translate.y).toBe(100);
        });
        it('should set the history of initial state to current history', () => {
            expect(setTransAndHistoryState.history).toEqual(currentStateMock.history);
        })
    });

    describe('undo', () => {
        const cloneNextStateMock = clone(nextStateMock);
        const undoState = mainReducer(cloneNextStateMock, {
            type: types.UN_DO
        });
        it('should set the data tree back to the previous data tree', () => {
            expect(undoState.data).toEqual(currentStateMock.data);
        });
        it('should set the translate back to the previous translate', () => {
            expect(undoState.translate).toEqual(currentStateMock.translate);
        });
        it('should set the history back to the previous history', () => {
            expect(undoState.history).toEqual(currentStateMock.history);
        });
        it('should set the current component back to the previous current component', () => {
            expect(undoState.currentComponent).toEqual(currentStateMock.currentComponent);
        });
        it('should set the linked template back to the previous linked template', () => {
            expect(undoState.nameAndCodeLinkedToComponentId).toEqual(currentStateMock.nameAndCodeLinkedToComponentId);
        });
        it('should set the last id back to the previous last id', () => {
            expect(undoState.lastId).toEqual(currentStateMock.lastId);
        });
        it('should set the default name count back to the previous default name count', () => {
            expect(undoState.defaultNameCount).toEqual(currentStateMock.defaultNameCount);
        });
        it('should set the template back to the previous templates', () => {
            expect(undoState.templates).toEqual(currentStateMock.templates);
        });

        const cloneInitialStateMock = clone(initialStateMock);
        const undoWithoutPrevState = mainReducer(cloneInitialStateMock, {
            type: types.UN_DO
        });
        it('should do nothing if history has no previous', () => {
            expect(undoWithoutPrevState).toEqual(initialStateMock);
        });
    });

    describe('redo', () => {
        const cloneCurrentStateMock = clone(currentStateMock);
        const redoState = mainReducer(cloneCurrentStateMock, {
            type: types.RE_DO
        });
        it('should set the data tree to the next data tree', () => {
            expect(redoState.data).toEqual(nextStateMock.data);
        });
        it('should set the translate to the next translate', () => {
            expect(redoState.translate).toEqual(nextStateMock.translate);
        });
        it('should set the history to the next history', () => {
            expect(redoState.history).toEqual(nextStateMock.history);
        });
        it('should set the current component to the next current component', () => {
            expect(redoState.currentComponent).toEqual(nextStateMock.currentComponent);
        });
        it('should set the linked template to the next linked template', () => {
            expect(redoState.nameAndCodeLinkedToComponentId).toEqual(nextStateMock.nameAndCodeLinkedToComponentId);
        });
        it('should set the last id to the next last id', () => {
            expect(redoState.lastId).toEqual(nextStateMock.lastId);
        });
        it('should set the default name count to the next default name count', () => {
            expect(redoState.defaultNameCount).toEqual(nextStateMock.defaultNameCount);
        });
        it('should set the template to the next templates', () => {
            expect(redoState.templates).toEqual(nextStateMock.templates);
        });

        const cloneNextStateMock = clone(nextStateMock);
        const redoWithoutNextState = mainReducer(cloneNextStateMock, {
            type: types.RE_DO
        });
        it('should do nothing if history has no next', () => {
            expect(redoWithoutNextState).toEqual(nextStateMock);
        });
    });
});

describe("Test Children List Actions", () => {
    describe('renameChild', () => {
        const cloneCurrentStateMock = clone(currentStateMock)
        const renameChildState = mainReducer(cloneCurrentStateMock, {
            type: types.RENAME_CHILD,
            payload: {
                inputName: 'TestRenameChild',
                childId: 1
            }
        });
        it('should rename the child as "TestRenameChild"', () => {
            expect(renameChildState.currentComponent.children[0].name).toEqual('TestRenameChild');
        });
        it('should store the previous name in the history', () => {
            expect(renameChildState.history.prev.value.currentComponent.children[0].name).toEqual(cloneCurrentStateMock.currentComponent.children[0].name);
        });
    });

    describe('changeChildType', () => {
        const cloneCurrentStateMock = clone(currentStateMock)
        const changeChildTypeState = mainReducer(cloneCurrentStateMock, {
            type: types.CHANGE_CHILD_TYPE,
            payload: {
                isChecked: true,
                childId: 1
            }
        });
        it('should change isContainer to true for first child of current component', () => {
            expect(changeChildTypeState.currentComponent.children[0].isContainer).toBe(true);
        });
        it('should store the previous container condition in the history', () => {
            expect(changeChildTypeState.history.prev.value.currentComponent.children[0].isContainer).toEqual(cloneCurrentStateMock.currentComponent.children[0].isContainer);
        });
    });

    
});