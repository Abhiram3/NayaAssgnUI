import React, { Component } from "react";
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { projectsFetchById } from "../actions/projects";
import { boardCreate } from "../actions/boards"

class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTitle: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(projectsFetchById(this.props.match.params.projectId));
  }

  handleBoardAdd = () => {
    const { dispatch } = this.props;
    dispatch(boardCreate(this.state.newTitle, this.props.selectedProject.id));
  }

  handleTitleChange = (e) => {
      this.setState({
        newTitle: e.target.value
      })
  }

  render() {
    return (
      <div>
        <Form className="project-form" >
          <Form.Group className="mb-3" controlId="formBasicEmail" value={this.state.newTitle}>
            <label className="form-label" >Please enter title of new board:</label>
            <input
              placeholder="Title Here..."
              type="text"
              className="form-control"
              value={this.state.newTitle}
              onChange={this.handleTitleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleBoardAdd}>
            Add New Board
          </Button>
        </Form>
        <div className="card-container">
        {this.props.selectedProject.loading &&
        (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        { !this.props.selectedProject.loading && this.props.selectedProject.boards.length &&
          this.props.selectedProject.boards.map(board => {
            const boardLink = `/board/${board._id}`;
            return (
              <li className="card-link">
                <Link className="card-link" to={boardLink} key={board.id}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Body>
                      <Card.Title>{board.title}</Card.Title>
                      <Card.Text>
                        This Board is created by {board.createdBy ? board.createdBy.name : 'admin'}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </li>
            );
          })}
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedProject } = state.projects;
  const { message } = state.message;
  return {
    selectedProject,
    message
  };
}

export default connect(mapStateToProps)(ProjectDetails);
