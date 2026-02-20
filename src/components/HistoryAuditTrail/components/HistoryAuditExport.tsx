import { useState } from 'react';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { HISTORY_AUDIT_LAYOUT } from '../constants';
import { ChevronDownIcon, DownloadIcon, FileSpreadsheetIcon } from './HistoryAuditTrailIcons';

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
        size="small"
        onClick={handleClick}
        aria-label="Export"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<DownloadIcon />}
        endIcon={<ChevronDownIcon />}
        sx={(theme) => ({
          height: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
          minHeight: HISTORY_AUDIT_LAYOUT.TOOLBAR_INPUT_HEIGHT,
          textTransform: 'none',
          borderRadius: HISTORY_AUDIT_LAYOUT.TOOLBAR_BORDER_RADIUS,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.common.white,
          color: theme.palette.text.secondary,
          '&:hover': {
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.action.hover,
          },
        })}
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
          <ListItemIcon sx={{ minWidth: 32 }}>
            <FileSpreadsheetIcon />
          </ListItemIcon>
          Export to Excel
        </MenuItem>
        <MenuItem onClick={handleExportCsv}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <FileSpreadsheetIcon />
          </ListItemIcon>
          Export to CSV
        </MenuItem>
      </Menu>
    </>
  );
};
