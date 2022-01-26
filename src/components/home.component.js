import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Welcome to Naya, {this.props.user.name}!!</h3>
        </header>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
    user
  };
}

export default connect(mapStateToProps)(Home);
