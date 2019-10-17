import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from '../components/User'

const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!,
                            $password: String!,
                            $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken,
                      password: $password,
                      confirmPassword: $confirmPassword) {
            id,
            email,
            name
        }
    }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }
  state = {
    password: '',
    confirmPassword: ''
  }

  saveToState = e => {
    const { name, value } = e.target
    this.setState(() => ({ [name]: value }));
    console.log(this.state)
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          ...this.state
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading }) => {
          return (
            <Form method='post' onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({
                password: '',
                confirmPassword: ''
              })
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset your password</h2>
                <Error error={error} />
                <label htmlFor='password'>
                  Password
                  <input
                    name='password'
                    type='password'
                    value={this.state.password}
                    onChange={this.saveToState}
                    placeholder='password' />
                </label>
                <label htmlFor='confirmPassword'>
                  Confirm your Password
                  <input
                    name='confirmPassword'
                    type='password'
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                    placeholder='Confirm password' />
                </label>
                <button type='submit'>Reset your password</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Reset;