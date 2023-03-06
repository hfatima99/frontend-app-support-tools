import React from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormAccountDetails = () => {
  const { ACCOUNT_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{ACCOUNT_DETAIL.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.displayName}
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          floatingLabel={ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}
        />
        <Form.Control.Feedback>
          {ACCOUNT_DETAIL.OPTIONS.totalAccountValue.subtitle}
        </Form.Control.Feedback>
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormAccountDetails;