import React, { Component } from "react";
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { projectCreate, projectsFetch } from "../actions/projects";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTitle: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(projectsFetch());
  }

  handleProjectAdd = () => {
    const { dispatch } = this.props;
    dispatch(projectCreate(this.state.newTitle));
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
            <label className="form-label" >Please enter title of new project:</label>
            <input
              placeholder="Title Here..."
              type="text"
              className="form-control"
              value={this.state.newTitle}
              onChange={this.handleTitleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleProjectAdd}>
            Add New Project
          </Button>
        </Form>
        <div className="card-container">
        {this.props.loading &&
        (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        { !this.props.loading && this.props.projects.map(project => {
          const projectLink = `/project/${project.id}`;
          return (
            <li className="card-link">
              <Link to={projectLink} key={project.id}>
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>
                      This Project is created by {project.createdBy ? project.createdBy.name : "admin"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </li>
          );
        }) }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projects, loading } = state.projects;
  const { message } = state.message;
  return {
    projects,
    loading,
    message
  };
}

export default connect(mapStateToProps)(Projects);
