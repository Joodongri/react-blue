import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Tree from 'react-d3-tree';
import clone from 'clone';
import { bindActionCreators } from 'redux';
import { 
    setCurrentComponent,
    setTransAndHistory,
    undo,
    redo,
} from '../actions/actions';

const mainDisplayContainerStyles = {
  position: "relative"
}

const containerStyles = {
  width: '100%',
  height: '600px',
  backgroundColor: 'lightBlue',
  overflow: "scroll",
};

const minimapContainerStyles = {
  width: '20%',
  backgroundColor: 'white',
  border: '1px solid black',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  bottom: "20px",
  right: "20px"
}

const minimapTreeStyles = {
  width: '90%',
  backgroundColor: 'lightGray',
  position: "relative",
  zIndex: '0',
}

// const scopeStyles = {
//   height: "60px",
//   width: '120px',
//   border: '1px solid black',
//   backgroundColor: 'lightBlue',
//   cursor: "move",
//   position: "absolute",
//   zIndex: "1",
// }

function DoublyLinkedList(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
}

const mapStateToProps = store => ({
    state: store.main,
    data: store.main.data,
    translate: store.main.translate,
    miniTranslate: store.main.miniTranslate
})

const mapDispatchToProps = dispatch => bindActionCreators(
    { 
        setCurrentComponent,
        setTransAndHistory,
        undo,
        redo,
    },
    dispatch
);

class MainDisplayContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hideMinimap: false,
      x: 0,
      y: 0,
      parentClassName: null,
    };

    this.dragScope = this.dragScope.bind(this);
    this.dragMouseDown = this.dragMouseDown.bind(this);
  }

  componentDidMount() {
    const initialHistory = new DoublyLinkedList(clone(this.props.state));
    // console.log('document.getElementsByTagName("g"): ', document.getElementsByTagName('g'));
    // translate sets the state of centering the tree on mount
    console.log('document.getElementsByClassName("componentTree"): ', document.getElementsByClassName("componentTree"));
    const dimensions = this.treeContainer.getBoundingClientRect();
    const miniDimensions = this.miniTreeContainer.getBoundingClientRect();
    console.log('this.treeContainer: ', this.treeContainer);
    console.log('dimensions: ', dimensions);
    console.log('miniDimensions: ', miniDimensions);

    this.props.setTransAndHistory({
            x: dimensions.width / 2,
            y: dimensions.height / 6,
        },
        {
          x: miniDimensions.width / 2,
          y: miniDimensions.height / 6, 
        },
        initialHistory
    );
    // const parentClassName = document.getElementsByTagName('g')[0].className.baseVal;
    // console.log(parentClassName);
    // this.setState({parentClassName})
  }

  dragScope(event) {

  }

  dragMouseDown(event) {

  }



  render() {
    return (
      <div id='main-display-container' style={mainDisplayContainerStyles}>
        <div>
          <button
            style={{
              width: '100px',
              height: '45px',
              backgroundColor: 'pink'
            }}
            onClick={this.props.undo}
          >
            Undo
          </button>
          <button
            style={{
              width: '100px',
              height: '45px',
              backgroundColor: 'pink'
            }}
            onClick={this.props.redo}
          >
            Redo
          </button>
        </div>

        <div className="componentTree" style={containerStyles} ref={tc => (this.treeContainer = tc)}>
          <Tree
            data={this.props.data}
            translate={this.props.translate}
            orientation={'vertical'}
            collapsible={false}
            nodeSvgShape={{
              shape: 'circle',
              shapeProps: { r: '30' }
            }}
            textLayout={{
              textAnchor: 'start',
              x: -30,
              y: -45
            }}
            onClick={(currentComponent) => {
              this.props.setCurrentComponent(currentComponent)}}
            transitionDuration={500}
          />
        </div>
        {!this.state.hideMinimap &&
          <div className="minimapContainer" style={minimapContainerStyles}>
            {/* <div className="scope" style={scopeStyles} >
            </div> */}
            <div className="minimapTreeComponent" style={minimapTreeStyles} ref={tc => (this.miniTreeContainer = tc)}>
              <Tree
                data={this.props.data}
                translate={this.props.miniTranslate}
                orientation={'vertical'}
                collapsible={false}
                zoom={0.2}
                zoomable={false}
                nodeSvgShape={{
                  shape: 'circle',
                  shapeProps: { r: '30' }
                }}
                textLayout={{
                  textAnchor: 'start',
                  x: -30,
                  y: -45
                }}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainDisplayContainer);
