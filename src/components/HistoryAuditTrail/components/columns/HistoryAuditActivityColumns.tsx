import { Avatar, Box, Chip, Typography } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

import { HistoryAuditTrailIconForType } from '../HistoryAuditTrailIcons';

import { getHistoryAuditAvatarStyle } from '../../utils';
import { HISTORY_AUDIT_LAYOUT } from '../../constants';

import type { HistoryAuditTrailTableRow } from '../../types';

export const HistoryAuditActivityColumns = ({
  data,
  node,
  api,
}: ICellRendererParams<HistoryAuditTrailTableRow>) => {
  if (!data) return null;

  const rowIndex = node?.rowIndex ?? 0;
  const rowCount = api?.getDisplayedRowCount?.() ?? 0;
  const isFirst = rowIndex === 0;
  const isLast = rowIndex === rowCount - 1;
  const avatarSize = HISTORY_AUDIT_LAYOUT.AVATAR_SIZE;
  const center = avatarSize / 2;
  const overlap = HISTORY_AUDIT_LAYOUT.TIMELINE_OVERLAP;

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 2, pr: 2, height: '100%' }}>
      <Box
        sx={{
          width: avatarSize,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          flexShrink: 0,
          height: '100%',
        }}
      >
        <Box
          sx={(theme) => {
            const paddingY = theme.spacing(2); // must match `py: 2` on this column
            const iconCenterTop = `calc(${paddingY} + ${center}px)`;
            const topOffset = isFirst ? iconCenterTop : `-${overlap}px`;
            const bottomOffset = isLast
              ? `calc(100% - (${paddingY} + ${center}px))`
              : `-${overlap}px`;

            return {
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: topOffset,
              bottom: bottomOffset,
              width: 2,
              bgcolor: theme.palette.divider,
              borderRadius: 999,
              zIndex: 0,
            };
          }}
        />

        <Avatar
          sx={(theme) => ({
            ...getHistoryAuditAvatarStyle(data.event.auditEventType)(theme),
            width: avatarSize,
            height: avatarSize,
            borderRadius: '999px',
            border: '1px solid',
            zIndex: 1,
          })}
        >
          <HistoryAuditTrailIconForType type={data.event.auditEventType} />
        </Avatar>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, py: 2, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: 'text.primary', minWidth: 0 }}
            noWrap
            title={data.actor}
          >
            {data.actor}
          </Typography>
          {data.badge ? (
            <Chip
              label={data.badge}
              size="small"
              sx={(theme) => ({
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
                borderRadius: '1px',
                bgcolor: theme.palette.grey[100],
                color: theme.palette.text.secondary,
                '& .MuiChip-label': { px: 1 },
              })}
            />
          ) : null}
          {data.moduleBadge ? (
            <Chip
              label={data.moduleBadge}
              size="small"
              sx={(theme) => ({
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
                borderRadius: '1px',
                bgcolor: data.moduleBadgeColor
                  ? `${data.moduleBadgeColor}14`
                  : theme.palette.grey[100],
                color: data.moduleBadgeColor ?? theme.palette.text.secondary,
                border: '1px solid',
                borderColor: data.moduleBadgeColor
                  ? `${data.moduleBadgeColor}4D`
                  : theme.palette.divider,
                '& .MuiChip-label': { px: 1 },
              })}
            />
          ) : null}
        </Box>

        <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
          {data.action}
        </Typography>

        {(data.details || (data.changeFrom && data.changeTo)) && (
          <Box sx={{ mt: 1 }}>
            {data.changeFrom && data.changeTo ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box
                  sx={(theme) => ({
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.75,
                    backgroundColor: `${theme.palette.error.main}14`,
                    color: theme.palette.error.main,
                    textDecoration: 'line-through',
                    fontSize: 12,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  })}
                  title={data.changeFrom ?? ''}
                >
                  {data.changeFrom}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  →
                </Typography>
                <Box
                  sx={(theme) => ({
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.75,
                    backgroundColor: `${theme.palette.success.main}14`,
                    color: theme.palette.success.main,
                    fontSize: 12,
                    fontWeight: 600,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  })}
                  title={data.changeTo ?? ''}
                >
                  {data.changeTo}
                </Box>
              </Box>
            ) : (
              <Box
                sx={(theme) => ({
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: 'none',
                  backgroundColor: theme.palette.grey[50],
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: theme.palette.text.secondary,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                })}
                title={data.details ?? ''}
              >
                {data.details}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
