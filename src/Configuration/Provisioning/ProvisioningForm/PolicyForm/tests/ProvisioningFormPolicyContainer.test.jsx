/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProvisioningFormPolicyContainer from '../ProvisioningFormPolicyContainer';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';

const { ACCOUNT_DETAIL, POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPolicyContainerWrapper = ({
  value = initialStateValue,
  sampleCatalogQuery = INITIAL_CATALOG_QUERIES.defaultQuery,
}) => (
  <ProvisioningContext value={value}>
    {sampleCatalogQuery.map(({ uuid, catalogQueryTitle }, index) => (
      <ProvisioningFormPolicyContainer
        key={uuid}
        title={catalogQueryTitle}
        index={index}
      />
    ))}
  </ProvisioningContext>
);

// TODO: Integration Tests
describe('ProvisioningFormPolicyContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_CATALOG_QUERIES.defaultQuery}
      />,
    );
    expect(screen.getByText(ACCOUNT_DETAIL.TITLE)).toBeTruthy();
    expect(screen.getByText(INITIAL_CATALOG_QUERIES.defaultQuery[0].catalogQueryTitle)).toBeTruthy();
  });
  it('renders multiple policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: true,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.multipleQueries,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_CATALOG_QUERIES.multipleQueries}
      />,
    );
    expect(screen.getAllByText(ACCOUNT_DETAIL.TITLE).length).toEqual(INITIAL_CATALOG_QUERIES.multipleQueries.length);
    expect(screen.getByText(INITIAL_CATALOG_QUERIES.multipleQueries[0].catalogQueryTitle)).toBeTruthy();
    expect(screen.getByText(INITIAL_CATALOG_QUERIES.multipleQueries[1].catalogQueryTitle)).toBeTruthy();
  });
  it('renders policy type and selects AssignedLearnerCreditAccessPolicy', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_CATALOG_QUERIES.defaultQuery}
      />,
    );
    expect(screen.getByText(POLICY_TYPE.TITLE)).toBeTruthy();
    expect(screen.getByText(POLICY_TYPE.LABEL)).toBeTruthy();
    const learnerOption = screen.getByTestId(POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION);
    await act(async () => {
      userEvent.click(learnerOption);
    });
    await waitFor(() => {
      expect(learnerOption.checked).toBeTruthy();
    });
  });
});
