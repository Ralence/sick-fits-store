/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };

  saveToState = e => {
    const { name, value } = e.target;
    this.setState(() => ({ [name]: value }));
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({
                email: '',
                name: '',
                password: '',
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up For An Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                  placeholder="email"
                />
              </label>
              <label htmlFor="name">
                Name
                <input
                  name="name"
                  type="text"
                  value={this.state.name}
                  onChange={this.saveToState}
                  placeholder="name"
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                  placeholder="password"
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
