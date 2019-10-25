import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h1>Manage permissions</h1>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>email</th>
                {possiblePermissions.map(item => (
                  <th key={item}>{item}</th>
                ))}
                <th style={{ fontWeight: 'bold' }}>&darr;</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = e => {
    const { value } = e.target;
    const { checked } = e.target;
    // check if the checkbox is checked or not
    // and based on it add or remove the value to the state
    if (checked) {
      this.setState(prevState => ({
        permissions: [...prevState.permissions, value],
      }));
    } else {
      this.setState(prevState => ({
        permissions: prevState.permissions.filter(item => item !== value),
      }));
    }
  };

  render() {
    console.log(this.state.permissions);

    const { user } = this.props;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <Fragment>
            {error && (
              <tr>
                <td colSpan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(item => (
                <td key={item}>
                  <label htmlFor={`${user.id}-permission-${item}`}>
                    <input
                      type="checkbox"
                      id={`${user.id}-permission-${item}`}
                      checked={this.state.permissions.includes(item)}
                      value={item}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </Fragment>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
