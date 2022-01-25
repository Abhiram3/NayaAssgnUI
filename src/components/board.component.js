import React, { Component } from "react";
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

// import BoardService from "../services/board.service";
import EventBus from "../common/EventBus";
import { boardsFetchById, updateBoardById } from '../actions/boards';

class Board extends Component {
  timeout;
  isDrawing = false;
  canvas;
  ctx;
  socket = socketIOClient("http://localhost:8080");
  color;

  constructor(props) {
    super(props);

    this.state = {
      title: 'B1',
      createdBy: 'Abhiram',
      collaborators: ['Abhiram', 'Abhiram2', 'Abhiram3']
    };
    this.color = this.props.user.color;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(boardsFetchById(this.props.match.params.boardId));
    // ProjectsService.getProjects().then(
    //   response => {
    //     console.log('response', response);
    //     this.setState({
    //       projects: response.data
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       content:
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString()
    //     });
    //
    //     if (error.response && error.response.status === 401) {
    //       EventBus.dispatch("logout");
    //     }
    //   }
    // );

    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps.savedImage', newProps.savedImage)
    if (newProps.savedImage) {
      var savedImage = new Image();
      var ctx = this.ctx;
      savedImage.onload = function() {
        ctx.drawImage(savedImage, 0, 0);
      };
      savedImage.src = newProps.savedImage;
    }
  }

  handleBoardSave = (e) => {
    const base64Image = this.canvas.toDataURL("image/png");
    console.log('base64Image', base64Image);
    const { dispatch } = this.props;
    dispatch(updateBoardById(this.props.match.params.boardId, { savedImage: base64Image}));
  }

  drawOnCanvas = () => {
    this.canvas = document.querySelector('#board');
    var canvas = this.canvas;
    this.ctx = canvas.getContext('2d');
    var ctx = this.ctx;
    var socket = this.socket;
    var color = this.color;
    var canvasPos = canvas.getBoundingClientRect();
    var offsetX = canvasPos.x;
    var offSetY = canvasPos.y;

    var sketch = document.querySelector('#board-container');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var current = {};
    var drawing = false;
    console.log('savedImage', this.props.savedImage);
    if (this.props.savedImage) {
      var savedImage = new Image();
      savedImage.src = this.props.savedImage;
      ctx.drawImage(savedImage, 0, 0);
    }
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    socket.on('drawing', onDrawingEvent);

    function drawLine(x0, y0, x1, y1, color, emit){
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      if (!emit) { return; }
      var w = canvas.width;
      var h = canvas.height;

      socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
      });
    }

    function onMouseDown(e){
      drawing = true;
      current.x = e.clientX - offsetX;
      current.y = e.clientY - offSetY;
    }

    function onMouseUp(e){
      if (!drawing) { return; }
      drawing = false;
      drawLine(current.x, current.y, e.clientX - offsetX, e.clientY - offSetY, color, true);
    }

    function onMouseMove(e){
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX - offsetX, e.clientY - offSetY, color, true);
      current.x = e.clientX - offsetX;
      current.y = e.clientY - offSetY;
    }


    // limit the number of events per second
    function throttle(callback, delay) {
      var previousCall = new Date().getTime();
      return function() {
        var time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }

    function onDrawingEvent(data){
      console.log('onDrawingEvent')
      var w = canvas.width;
      var h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

  }

  render() {
    return (
      <div className="board-container" id="board-container">
        {this.props.loading && (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )
        }
        <canvas
          className="board"
          id="board"
        />
        <Button variant="secondary" type="submit" onClick={this.handleBoardSave}>
          Save
        </Button>
        <ul className="collab-list">
          <li>Collaborators: </li>
          {!this.props.loading && this.props.collaborators.length && this.props.collaborators.map(user => {
            return (
              <li>{user.name}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { title, createdBy, collaborators, savedImage } = state.board.details;
  const { message } = state.message;
  const { user } = state.auth;
  return {
    user,
    title,
    createdBy,
    collaborators,
    savedImage,
    loading: state.board.loading
  };
}

export default connect(mapStateToProps)(Board);
