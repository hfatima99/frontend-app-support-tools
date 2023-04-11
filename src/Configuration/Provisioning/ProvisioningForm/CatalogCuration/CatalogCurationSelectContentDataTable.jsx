import {
  DataTable,
  CardView,
} from '@edx/paragon';
import { connectStateResults } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { FOOTER_TEXT_BY_CONTENT_TYPE } from './data/utils';
import SelectContentSelectionCheckbox from './SelectContentSelectionCheckbox';
import { MAX_PAGE_SIZE } from './data/constants';
import SelectContentSelectionStatus from './SelectContentSelectionStatus';
import SkeletonContentCard from './SkeletonContentCard';
import ContentSearchResultCard from './ContentSearchResultCard';
import SelectContentSearchPagination from './SelectContentSearchPagination';

const defaultActiveStateValue = 'card';

const selectColumn = {
  id: 'selection',
  Header: () => null,
  Cell: SelectContentSelectionCheckbox,
  disableSortBy: true,
};

const PriceTableCell = ({ row }) => {
  const contentPrice = row.original.firstEnrollablePaidSeatPrice;
  if (!contentPrice) {
    return null;
  }
  return `$${contentPrice}`;
};

PriceTableCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      firstEnrollablePaidSeatPrice: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

const ContentTypeTableCell = ({ row }) => FOOTER_TEXT_BY_CONTENT_TYPE[row.original.contentType.toLowerCase()];

const BaseHighlightStepperSelectContentDataTable = ({
  selectedRowIds,
  onSelectedRowsChanged,
  isSearchStalled,
  searchResults,
}) => {
  const [currentView, setCurrentView] = useState(defaultActiveStateValue);
  // TODO: searchResults contain all information before its populated into the datatable (do manual filtering here)
  const tableData = useMemo(() => camelCaseObject(searchResults?.hits || []), [searchResults]);
  const searchResultsItemCount = searchResults?.nbHits || 0;
  const searchResultsPageCount = searchResults?.nbPages || 0;
  return (
    <DataTable
      isLoading={isSearchStalled}
      onSelectedRowsChanged={onSelectedRowsChanged}
      dataViewToggleOptions={{
        isDataViewToggleEnabled: true,
        onDataViewToggle: val => setCurrentView(val),
        defaultActiveStateValue,
        togglePlacement: 'left',
      }}
      isSelectable
      isPaginated
      manualPagination
      initialState={{
        pageIndex: 0,
        pageSize: MAX_PAGE_SIZE,
        selectedRowIds,
      }}
      pageCount={searchResultsPageCount}
      itemCount={searchResultsItemCount}
      initialTableOptions={{
        getRowId: row => row?.aggregationKey,
        autoResetSelectedRows: false,
      }}
      data={tableData}
      manualSelectColumn={selectColumn}
      SelectionStatusComponent={SelectContentSelectionStatus}
      columns={[
        {
          Header: 'Content name',
          accessor: 'title',
        },
        {
          Header: 'Partner',
          accessor: 'partners[0].name',
        },
        {
          Header: 'Content type',
          Cell: ContentTypeTableCell,
        },
        {
          Header: 'Price',
          Cell: PriceTableCell,
        },
      ]}
    >
      <DataTable.TableControlBar />
      {currentView === 'card' && (
        <CardView
          columnSizes={{
            xs: 12,
            md: 6,
            lg: 4,
          }}
          SkeletonCardComponent={SkeletonContentCard}
          CardComponent={ContentSearchResultCard}
        />
      )}
      {currentView === 'list' && <DataTable.Table /> }
      <DataTable.EmptyTable content="No results found" />
      <DataTable.TableFooter>
        <SelectContentSearchPagination />
      </DataTable.TableFooter>
    </DataTable>
  );
};

BaseHighlightStepperSelectContentDataTable.propTypes = {
  selectedRowIds: PropTypes.shape().isRequired,
  onSelectedRowsChanged: PropTypes.func.isRequired,
  isSearchStalled: PropTypes.bool.isRequired,
  searchResults: PropTypes.shape({
    hits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    nbHits: PropTypes.number.isRequired,
    nbPages: PropTypes.number.isRequired,
  }),
};

BaseHighlightStepperSelectContentDataTable.defaultProps = {
  searchResults: null,
};

const CatalogCurationSelectContentDataTable = connectStateResults(BaseHighlightStepperSelectContentDataTable);

export default CatalogCurationSelectContentDataTable;