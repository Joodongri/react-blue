import { DoublyLinkedList } from '../client/reducers/utils/updateTree'

const appComponent = {
    name: "App",
    depth: 0,
    id: 0,
    componentId: 0,
    isContainer: true,
    children: []
};

const childComponent1 = {
    name: "childComponent1",
    depth: 1,
    id: 1,
    componentId: 1,
    parent: appComponent,
    isContainer: false,
    children: []
}

const childComponent2 = {
    name: "childComponent2",
    depth: 1,
    id: 2,
    componentId: 2,
    parent: appComponent,
    isContainer: false,
    children: []
}

const appComponentWithOneChild = {
    name: "App",
    depth: 0,
    id: 0,
    componentId: 0,
    isContainer: true,
    children: [childComponent1]
};

const appComponentWithTwoChildren = {
    name: "App",
    depth: 0,
    id: 0,
    componentId: 0,
    isContainer: true,
    children: [childComponent1, childComponent2]
};

const classTemplete = {
    name: 'Test Class Default',
    code: 'test class code'
}

const hooksTemplate = {
    name: 'Test Hooks Default',
    code: 'test hooks code'
}

const initialHistory = new DoublyLinkedList({
    data: appComponent,
    translate: { x: 0, y: 0 },
    currentComponent: appComponent,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete
    },
    lastId: 0,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate]
});

const currentHistory = new DoublyLinkedList({
    data: appComponentWithOneChild,
    translate: { x: 50, y: 50 },
    currentComponent: appComponentWithOneChild,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete, 
        1: hooksTemplate
    },
    lastId: 1,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate]
});

const nextHistory = new DoublyLinkedList({
    data: appComponentWithTwoChildren,
    translate: { x: 50, y: 50 },
    currentComponent: childComponent1,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete, 
        1: hooksTemplate,
        2: hooksTemplate
    },
    lastId: 2,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate],
});

initialHistory.next = currentHistory;
currentHistory.prev = initialHistory;
currentHistory.next = nextHistory;
nextHistory.prev = currentHistory;

export const initialStateMock = {
    data: appComponent,
    translate: { x: 0, y: 0 },
    history: initialHistory,
    currentComponent: appComponent,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete
    },
    lastId: 0,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate],
    orientation: "vertical"
};

export const currentStateMock = {
    data: appComponentWithOneChild,
    translate: { x: 50, y: 50 },
    history: currentHistory,
    currentComponent: appComponentWithOneChild,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete, 
        1: hooksTemplate
    },
    lastId: 1,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate],
    orientation: "vertical"
}

export const nextStateMock = {
    data: appComponentWithTwoChildren,
    translate: { x: 50, y: 50 },
    history: nextHistory,
    currentComponent: childComponent1,
    nameAndCodeLinkedToComponentId: {
        0: classTemplete, 
        1: hooksTemplate,
        2: hooksTemplate
    },
    lastId: 2,
    defaultNameCount: 0,
    templates: [classTemplete, hooksTemplate],
    orientation: "vertical"
}
