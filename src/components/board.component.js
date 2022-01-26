import React, { Component } from "react";
import { Button, Spinner, Modal, Tabs, Tab } from 'react-bootstrap';
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faFont, faFileImage } from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone-uploader';

import { boardsFetchById, updateBoardById, fetchUploadedImages } from '../actions/boards';
import { API_URL } from '../constants';

class Board extends Component {
  canvas;
  ctx;
  socket;
  color;
  drawing = false;
  current = {};
  offsetX;
  offSetY;

  constructor(props) {
    super(props);

    this.state = {
      selectedTool: 'pencil',
      toolText:'',
      showImageModal: false,
      selectedImageKey: ''
    };
    this.color = this.props.user.color;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(boardsFetchById(this.props.match.params.boardId));
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.savedImage) {
      var savedImage = new Image();
      var ctx = this.ctx;
      savedImage.onload = function() {
        ctx.drawImage(savedImage, 0, 0);
      };
      savedImage.src = newProps.savedImage;
    }
  }

  handleToolSelect = (newTool) => {
    const { dispatch } = this.props;
    const updates = { selectedTool: newTool };
    if (newTool === 'image') {
      updates.showImageModal = true;
      dispatch(fetchUploadedImages());
    }
    this.setState(updates);
  }

  handleToolTextChange = (e) => {
    this.setState({
      toolText: e.target.value
    })
  }

  insertText = (text, color, x, y, emit) => {
    this.ctx.fillStyle = this.props.user.color;
    this.ctx.font = "20px Arial";
    this.ctx.fillText(text, x, y);
    if (!emit) { return; }
    var w = this.canvas.width;
    var h = this.canvas.height;
    this.socket.emit('drawing', {
      x: x / w,
      y: y / h,
      type: 'text',
      text,
      color: this.props.user.color
    });
  }

  insertImage = (imageName, x, y, emit) => {
    const imageToInsert = new Image();
    imageToInsert.crossOrigin = "anonymous";
    var ctx = this.ctx;
    imageToInsert.onload = function() {
      ctx.drawImage(imageToInsert, x, y, 100, 100 * (imageToInsert.height / imageToInsert.width));
    }
    imageToInsert.src = `${API_URL}uploadedImages/${imageName}`;
    if (!emit) { return; }
    var w = this.canvas.width;
    var h = this.canvas.height;
    this.socket.emit('drawing', {
      x: x / w,
      y: y / h,
      type: 'image',
      imageName
    });
  }

  onMouseDown = (e) => {
    const x = e.clientX - this.offsetX;
    const y = e.clientY - this.offSetY;
    const currentColor = this.props.user.color;
    if (this.state.selectedTool === 'text') {
      this.insertText(this.state.toolText, currentColor, x, y, true);
    } else if (this.state.selectedTool === 'image') {
      this.insertImage(this.state.selectedImageKey, x, y, true);
    } else {
      this.drawing = true;
      this.current.x = e.clientX - this.offsetX;
      this.current.y = e.clientY - this.offSetY;
    }
  }

  onMouseUp = (e) => {
    if (!this.drawing) { return; }
    this.drawing = false;
    this.drawLine(this.current.x, this.current.y, e.clientX - this.offsetX, e.clientY - this.offSetY, this.props.user.color, true);
  }

  onMouseMove = (e) => {
    if (!this.drawing) { return; }
    this.drawLine(this.current.x, this.current.y, e.clientX - this.offsetX, e.clientY - this.offSetY, this.props.user.color, true);
    this.current.x = e.clientX - this.offsetX;
    this.current.y = e.clientY - this.offSetY;
  }

  onDrawingEvent = (data) => {
    var w = this.canvas.width;
    var h = this.canvas.height;
    if (data.type === "text") {
      this.insertText(data.text, data.color, data.x * w, data.y * h);
    } else if (data.type === "image") {
      this.insertImage(data.imageName, data.x * w, data.y * h);
    } else {
      this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }
  }

  drawLine = (x0, y0, x1, y1, color, emit) => {
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();

    if (!emit) { return; }
    var w = this.canvas.width;
    var h = this.canvas.height;

    this.socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: this.props.user.color
    });
  }

  handleBoardSave = (e) => {
    const base64Image = this.canvas.toDataURL("image/png");
    const { dispatch } = this.props;
    dispatch(updateBoardById(this.props.match.params.boardId, { savedImage: base64Image}));
  }

  drawOnCanvas = () => {
    this.canvas = document.querySelector('#board');
    var canvas = this.canvas;
    this.ctx = canvas.getContext('2d');
    this.socket = socketIOClient(API_URL);
    var socket = this.socket;
    var canvasPos = canvas.getBoundingClientRect();
    this.offsetX = canvasPos.x;
    this.offSetY = canvasPos.y;

    var sketch = document.querySelector('#board-container');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    if (this.props.savedImage) {
      var savedImage = new Image();
      savedImage.src = this.props.savedImage;
      this.ctx.drawImage(savedImage, 0, 0);
    }
    canvas.addEventListener('mousedown', this.onMouseDown, false);
    canvas.addEventListener('mouseup', this.onMouseUp, false);
    canvas.addEventListener('mouseout', this.onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(this.onMouseMove, 10), false);

    socket.on('drawing', this.onDrawingEvent);


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
  }

  handleImageModalClose = () => {
    this.setState({
      showImageModal: false
    })
  }

  getUploadParams = () => {
    return { url: `${API_URL}uploadedImages` }
  }

  handleChangeStatus = ({ meta, remove }, status) => {
  }

  handleSubmit = (files, allFiles) => {
    allFiles.forEach(f => f.remove())
  }

  handleImageSelect = (imageName) => {
    this.setState({
      selectedImageKey: imageName
    });
  }

  handleImageList = (eventKey) => {
    if (eventKey === "images") {
      const { dispatch } = this.props;
      dispatch(fetchUploadedImages());
    }
  }

  renderImageModal = () => {
    return (
      <Modal show={this.state.showImageModal} size="lg" onHide={this.handleImageModalClose}>
        <Modal.Header>
          <Modal.Title>Image Tool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="images" transition={false} id="noanim-tab-example" onSelect={this.handleImageList}>
            <Tab eventKey="images" title="Images">
              {(this.props.uploadedImages && this.props.uploadedImages.length) ? (
                <ul className="uploaded-image-container">
                  {this.props.uploadedImages.map(imageName => {
                    const imageSrc = `${API_URL}uploadedImages/${imageName}`;
                    return (
                      <li
                        onClick={() => this.handleImageSelect(imageName)}
                        className={this.state.selectedImageKey === imageName ? "image-container-active" : "image-container"}
                      >
                        <img src={imageSrc} className="uploaded-image-list" />
                      </li>
                    );
                  })}
                </ul>
              ) : (<p>No Images uploaded!!!</p>)}
            </Tab>
            <Tab eventKey="upload" title="Upload">
              <Dropzone
                className="image-preview"
                getUploadParams={this.getUploadParams}
                onChangeStatus={this.handleChangeStatus}
                maxFiles={1}
                multiple={false}
                canCancel={false}
                onSubmit={this.handleSubmit}
                inputContent="Drop A File"
                styles={{
                  dropzone: { width: 400, height: 200, minHeight: 200, maxHeight: 250  },
                  dropzoneActive: { borderColor: 'green' },
                }}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleImageModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
        <ul className="collab-list">
          <li>Collaborators: </li>
          {!this.props.loading && this.props.collaborators.length && this.props.collaborators.map(user => {
            return (
              <li>{user.name}</li>
            );
          })}
        </ul>
        <div className="tools-container">
          <Button variant="secondary" type="submit" onClick={this.handleBoardSave}>
            Save
          </Button>
          <div
            className={this.state.selectedTool === "pencil" ? "tool active-tool" : "tool"}
            onClick={(e) => this.handleToolSelect("pencil")}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </div>
          <div
            className={this.state.selectedTool === "text" ? "tool active-tool" : "tool"}
            onClick={(e) => this.handleToolSelect("text")}
          >
            <FontAwesomeIcon className="text-tool-icon" icon={faFont} />
            <input type="text" value={this.state.toolText} onChange={this.handleToolTextChange} />
          </div>
          <div
            className={this.state.selectedTool === "image" ? "tool active-tool" : "tool"}
            onClick={(e) => this.handleToolSelect("image")}
          >
            <FontAwesomeIcon icon={faFileImage} />
          </div>
        </div>
        { this.renderImageModal() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { uploadedImages, loading } = state.board;
  const { title, createdBy, collaborators, savedImage } = state.board.details;
  const { message } = state.message;
  const { user } = state.auth;
  return {
    user,
    title,
    createdBy,
    collaborators,
    savedImage,
    uploadedImages,
    loading,
    message
  };
}

export default connect(mapStateToProps)(Board);
