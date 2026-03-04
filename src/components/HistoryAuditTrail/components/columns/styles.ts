import type { SxProps, Theme } from '@mui/material/styles';

import type { HistoryAuditActionStyle } from '../../types';

export const historyAuditActivityRootStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'stretch',
  gap: 2,
  pr: 2,
  height: '100%',
};

export const getHistoryAuditTimelineColumnStyles = (avatarSize: number): SxProps<Theme> => ({
  width: avatarSize,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  py: 2,
  flexShrink: 0,
  height: '100%',
});

export const getHistoryAuditTimelineLineStyles =
  (center: number, isFirst: boolean, isLast: boolean, overlap: number): SxProps<Theme> =>
  (theme) => {
    const paddingY = theme.spacing(2);
    const iconCenterTop = `calc(${paddingY} + ${center}px)`;
    const topOffset = isFirst ? iconCenterTop : `-${overlap}px`;
    const bottomOffset = isLast ? `calc(100% - (${paddingY} + ${center}px))` : `-${overlap}px`;

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
  };

export const getHistoryAuditAvatarStyles =
  (
    avatarSize: number,
    actionAvatarStyles: (theme: Theme) => Record<string, unknown>,
    actionStyle?: HistoryAuditActionStyle,
  ): SxProps<Theme> =>
  (theme) => ({
    ...actionAvatarStyles(theme),
    ...(actionStyle?.backgroundColor ? { bgcolor: actionStyle.backgroundColor } : {}),
    ...(actionStyle?.iconColor ? { color: actionStyle.iconColor } : {}),
    ...(actionStyle?.borderColor ? { borderColor: actionStyle.borderColor } : {}),
    width: avatarSize,
    height: avatarSize,
    borderRadius: '999px',
    border: '1px solid',
    zIndex: 1,
  });

export const historyAuditActivityBodyStyles: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  py: 2,
  height: '100%',
};

export const historyAuditActivityMetaRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 0.5,
  minWidth: 0,
};

export const historyAuditActorStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: 'text.primary',
  minWidth: 0,
};

export const historyAuditCreatedByStyles: SxProps<Theme> = {
  display: 'block',
  color: 'text.secondary',
  mb: 0.5,
  minWidth: 0,
  whiteSpace: 'normal',
  wordBreak: 'break-word',
};

export const historyAuditSmallBadgeStyles: SxProps<Theme> = {
  height: 20,
  fontSize: '0.7rem',
  fontWeight: 500,
  '& .MuiChip-label': { px: 1 },
};

export const historyAuditActionTextStyles: SxProps<Theme> = { color: 'text.primary', mb: 0.5 };

export const historyAuditDetailsSectionStyles: SxProps<Theme> = {
  mt: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const historyAuditDetailsBoxStyles: SxProps<Theme> = (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : theme.palette.grey[50],
  fontSize: 12,
  lineHeight: 1.4,
  color: theme.palette.text.primary,
  maxWidth: '100%',
  display: 'block',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
});

export const historyAuditFieldChangesListStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

export const historyAuditFieldChangeRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexWrap: 'wrap',
  minWidth: 0,
};

export const historyAuditFieldLabelStyles: SxProps<Theme> = {
  color: 'text.secondary',
  flexShrink: 0,
};

export const historyAuditFromValueStyles: SxProps<Theme> = (theme) => ({
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
});

export const historyAuditArrowStyles: SxProps<Theme> = { color: 'text.disabled' };

export const getHistoryAuditToValueStyles =
  (showFrom: boolean): SxProps<Theme> =>
  (theme) => ({
    px: 1,
    py: 0.25,
    borderRadius: 0.75,
    backgroundColor: showFrom
      ? `${theme.palette.success.main}14`
      : `${theme.palette.text.primary}08`,
    color: showFrom ? theme.palette.success.main : theme.palette.text.secondary,
    border: showFrom ? 'none' : `1px solid ${theme.palette.divider}`,
    fontSize: 12,
    fontWeight: showFrom ? 600 : 400,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

export const historyAuditTriggeredByRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 0.75,
  flexWrap: 'wrap',
};

export const historyAuditTriggeredByLabelStyles: SxProps<Theme> = { color: 'text.secondary' };
export const historyAuditTriggeredByValueStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.primary',
};
export const historyAuditTriggeredByActionStyles: SxProps<Theme> = { color: 'text.secondary' };

export const historyAuditContextDetailsWrapStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1.25,
};

export const historyAuditContextDetailItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 0.5,
  minWidth: 0,
};

export const historyAuditContextDetailKeyStyles: SxProps<Theme> = { color: 'text.secondary' };
export const historyAuditContextDetailValueStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.primary',
  minWidth: 0,
  whiteSpace: 'normal',
  wordBreak: 'break-word',
};

export const historyAuditTimestampRootStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  py: 2,
};

export const historyAuditTimestampTopRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

export const historyAuditTimestampDotStyles: SxProps<Theme> = {
  width: 6,
  height: 6,
  borderRadius: 999,
  bgcolor: 'text.disabled',
};

export const historyAuditTimestampAgoStyles: SxProps<Theme> = { color: 'text.secondary' };
export const historyAuditTimestampValueStyles: SxProps<Theme> = {
  color: 'text.disabled',
  mt: 0.25,
};
