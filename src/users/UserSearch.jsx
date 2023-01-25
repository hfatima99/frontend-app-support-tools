import React, {
  useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Form } from '@edx/paragon';

export default function UserSearch({ userIdentifier, searchHandler }) {
  const searchRef = useRef();

  const submit = useCallback((event) => {
    searchHandler(searchRef.current.value);
    event.preventDefault();
    return false;
  });

  return (
    <section className="mb-3">
      <form className="m-0 row">
        <Form.Label className="mt-2" htmlFor="userIdentifier">Username, Email or LMS User ID</Form.Label>
        <Form.Control
          as="input"
          ref={searchRef}
          className="flex-grow-1 ml-1 mr-1"
          name="userIdentifier"
          defaultValue={userIdentifier}
        />

        <Button type="submit" onClick={submit} variant="primary">Search</Button>
      </form>

    </section>
  );
}

UserSearch.propTypes = {
  userIdentifier: PropTypes.string,
  searchHandler: PropTypes.func.isRequired,
};

UserSearch.defaultProps = {
  userIdentifier: '',
};

// <form className="form-inline">
//   <label htmlFor="userIdentifier">Username, Email or LMS User ID</label>
//   <Input ref={searchRef} className="flex-grow-1 ml-1 mr-1" name="userIdentifier" type="text" defaultValue={userIdentifier} />
//   <Button type="submit" onClick={submit} variant="primary">Search</Button>
// </form>
