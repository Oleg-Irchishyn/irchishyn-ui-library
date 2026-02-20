import { Box } from '@mui/material';

import { HistoryAuditTrailLoader } from './components/HistoryAuditTrailLoader';
import { HistoryAuditTrailEmpty } from './components/HistoryAuditTrailEmpty';
import { HistoryAuditTrailHeader } from './components/HistoryAuditTrailHeader';
import { HistoryAuditTrailTable } from './components/HistoryAuditTrailTable';
import { useHistoryAuditTrail } from './useHistoryAuditTrail';

import { HISTORY_AUDIT_LABELS } from './constants';
import type { HistoryAuditTrailProps } from './types';

export const HistoryAuditTrail = ({
  events,
  title = 'Activity History',
  countLabel,
  enableExport = false,
  exportFileName,
  moduleSources,
  primaryModuleSource,
  moduleFilterCallback,
  allModulesLabel,
  loading = false,
  onItemClick,
  onClear,
  height,
  sx,
}: HistoryAuditTrailProps) => {
  const {
    rowData,
    columnDefs,
    defaultColDef,
    onRowClicked,
    getRowId,
    quickFilterText,
    setQuickFilterText,
    filteredRowCount,
    isSearchActive,
    displayedCountLabel,
    moduleDropdown,
    handleClear,
    onGridReady,
    handleDownloadExcel,
    handleDownloadCsv,
    getContextMenuItems,
  } = useHistoryAuditTrail({
    events,
    onItemClick,
    countLabel,
    onClear,
    enableExport,
    exportFileName,
    moduleSources,
    primaryModuleSource,
    moduleFilterCallback,
    allModulesLabel,
  });

  return (
    <Box data-testid="history-audit-trail" sx={{ width: '100%', ...((sx as object) ?? {}) }}>
      <HistoryAuditTrailHeader
        title={title}
        countLabel={displayedCountLabel}
        onClear={handleClear}
        moduleDropdown={moduleDropdown}
        search={{
          searchValue: quickFilterText,
          onSearchValueChange: setQuickFilterText,
        }}
        export={
          enableExport
            ? {
                onExportExcel: handleDownloadExcel,
                onExportCsv: handleDownloadCsv,
                enableExport,
              }
            : undefined
        }
      />

      <Box sx={{ position: 'relative' }}>
        {loading && rowData.length === 0 ? (
          <HistoryAuditTrailLoader />
        ) : rowData.length === 0 ? (
          <HistoryAuditTrailEmpty />
        ) : isSearchActive && filteredRowCount === 0 ? (
          <HistoryAuditTrailEmpty message={HISTORY_AUDIT_LABELS.NO_DATA_TO_DISPLAY} />
        ) : (
          <HistoryAuditTrailTable
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClicked}
            getRowId={getRowId}
            quickFilterText={quickFilterText}
            getContextMenuItems={getContextMenuItems}
            onGridReady={onGridReady}
            height={height}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
};
