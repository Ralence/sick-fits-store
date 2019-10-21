import { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>shop</a>
        </Link>
        {me && (
          <Fragment>
            <Link href="/sell">
              <a>sell</a>
            </Link>
            <Link href="/orders">
              <a>orders</a>
            </Link>
            <Link href="/me">
              <a>account</a>
            </Link>
            <Signout />
          </Fragment>
        )}
        {!me && (
          <Link href="/signup">
            <a>sign in</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
