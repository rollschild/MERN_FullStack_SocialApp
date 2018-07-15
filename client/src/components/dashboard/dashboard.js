import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";
import { logoutUser } from "../../actions/authActions";
import Experience from "./Experience";
import Education from "./Education";

class Dashboard extends Component {
  // lifecycle method
  // AJAX request
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // first checkt to see if logged in user has profile
      if (Object.keys(profile).length > 0) {
        dashboardContent = ( // I want there username to be a link
          // to link to their profile
          <div>
            <p className="lead text-muted">
              Welcome{" "}
              <Link to={`/profiles/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div sytle={{ marginBottom: "60px" }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          </div>
        );
      } else {
        // user logged in but not profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile. Please add one!</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
      // dashboardContent = <h1>Hello!</h1>;
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, logoutUser }
)(Dashboard);
