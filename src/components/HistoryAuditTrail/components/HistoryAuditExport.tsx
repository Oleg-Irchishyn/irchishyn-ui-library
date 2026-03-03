import { useState } from 'react';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { ChevronDownIcon, DownloadIcon, FileSpreadsheetIcon } from './HistoryAuditTrailIcons';
import { historyAuditExportButtonStyles, historyAuditListItemIconStyles } from './styles';

export interface HistoryAuditExportProps {
  onExportExcel?: () => void;
  onExportCsv?: () => void;
}

export const HistoryAuditExport = ({ onExportExcel, onExportCsv }: HistoryAuditExportProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    onExportExcel?.();
    handleClose();
  };

  const handleExportCsv = () => {
    onExportCsv?.();
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        data-testid="history-audit-trail-export-button"
        size="small"
        onClick={handleClick}
        aria-label="Export"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<DownloadIcon />}
        endIcon={<ChevronDownIcon />}
        sx={historyAuditExportButtonStyles}
      >
        Export
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon sx={historyAuditListItemIconStyles}>
            <FileSpreadsheetIcon />
          </ListItemIcon>
          Export to Excel
        </MenuItem>
        <MenuItem onClick={handleExportCsv}>
          <ListItemIcon sx={historyAuditListItemIconStyles}>
            <FileSpreadsheetIcon />
          </ListItemIcon>
          Export to CSV
        </MenuItem>
      </Menu>
    </>
  );
};
