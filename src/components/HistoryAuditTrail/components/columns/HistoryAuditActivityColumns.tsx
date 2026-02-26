import { Avatar, Box, Chip, Typography } from '@mui/material';

import { BotIcon, HistoryAuditTrailIconForType } from '../HistoryAuditTrailIcons';

import {
  detailLabelForKey,
  extractTriggeredBy,
  getHistoryAuditAvatarStyle,
  isNonEmptyString,
  isTriggeredByKey,
} from '../../utils';
import { HISTORY_AUDIT_DETAIL_TEXT, HISTORY_AUDIT_LAYOUT } from '../../constants';

import type { HistoryAuditActivityRendererParams } from '../../types';

export const HistoryAuditActivityColumns = ({
  data,
  node,
  api,
  actionStyles,
  defaultActionStyle,
}: HistoryAuditActivityRendererParams) => {
  if (!data) return null;

  const rowIndex = node?.rowIndex ?? 0;
  const rowCount = api?.getDisplayedRowCount?.() ?? 0;
  const isFirst = rowIndex === 0;
  const isLast = rowIndex === rowCount - 1;
  const avatarSize = HISTORY_AUDIT_LAYOUT.AVATAR_SIZE;
  const center = avatarSize / 2;
  const overlap = 0;

  const normalizedAdditionalDetails = (data.event.additionalDetails ?? [])
    .filter((i) => isNonEmptyString(i?.key) && isNonEmptyString(i?.value))
    .map((i) => ({ key: i.key.trim(), value: i.value.trim() }));

  const triggeredBy = extractTriggeredBy(normalizedAdditionalDetails);
  const contextualDetails = normalizedAdditionalDetails.filter((i) => !isTriggeredByKey(i.key));

  const detailsText = isNonEmptyString(data.event.details) ? data.event.details : null;

  const resolvedChanges =
    (
      data.event.fieldChanges?.filter(
        (c) => isNonEmptyString(c.fieldName) || c.oldValue != null || c.newValue != null,
      ) ?? []
    ).length > 0
      ? (data.event.fieldChanges ?? [])
      : data.event.oldValue != null || data.event.newValue != null
        ? [
            {
              fieldName: null,
              oldValue: data.event.oldValue ?? null,
              newValue: data.event.newValue ?? null,
            },
          ]
        : [];

  const hasDetailSection =
    Boolean(detailsText) ||
    resolvedChanges.length > 0 ||
    contextualDetails.length > 0 ||
    Boolean(triggeredBy);
  const isSystemActivity = Boolean(data.badge);
  const actionStyle = actionStyles?.[data.event.auditEventType] ?? defaultActionStyle;

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
            ...(actionStyle?.backgroundColor ? { bgcolor: actionStyle.backgroundColor } : {}),
            ...(actionStyle?.iconColor ? { color: actionStyle.iconColor } : {}),
            ...(actionStyle?.borderColor ? { borderColor: actionStyle.borderColor } : {}),
            width: avatarSize,
            height: avatarSize,
            borderRadius: '999px',
            border: '1px solid',
            zIndex: 1,
          })}
        >
          {isSystemActivity ? (
            <BotIcon />
          ) : (
            (actionStyle?.icon ?? <HistoryAuditTrailIconForType type={data.event.auditEventType} />)
          )}
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
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.action.hover
                    : theme.palette.grey[100],
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
                  : theme.palette.mode === 'dark'
                    ? theme.palette.action.hover
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

        {hasDetailSection ? (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {detailsText ? (
              <Box
                sx={(theme) => ({
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: 'none',
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.action.hover
                      : theme.palette.grey[50],
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: theme.palette.text.primary,
                  maxWidth: '100%',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                })}
              >
                {detailsText}
              </Box>
            ) : null}

            {resolvedChanges.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {resolvedChanges.map((change, idx) => {
                  const fieldLabel = isNonEmptyString(change.fieldName)
                    ? change.fieldName.trim()
                    : null;
                  const from = change.oldValue ?? null;
                  const to = change.newValue ?? null;

                  const showFrom = from != null && String(from).trim() !== '';
                  const showTo = to != null && String(to).trim() !== '';

                  if (!showFrom && !showTo && !fieldLabel) return null;

                  return (
                    <Box
                      key={`${data.id}-change-${idx}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                        minWidth: 0,
                      }}
                    >
                      {fieldLabel ? (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', flexShrink: 0 }}
                        >
                          {`${HISTORY_AUDIT_DETAIL_TEXT.FIELD_LABEL_PREFIX} ${fieldLabel}`}
                        </Typography>
                      ) : null}

                      {showFrom ? (
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
                          title={String(from ?? '')}
                        >
                          {String(from)}
                        </Box>
                      ) : null}

                      {showFrom && showTo ? (
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          {HISTORY_AUDIT_DETAIL_TEXT.CHANGE_ARROW}
                        </Typography>
                      ) : null}

                      {showTo ? (
                        <Box
                          sx={(theme) => ({
                            px: 1,
                            py: 0.25,
                            borderRadius: 0.75,
                            backgroundColor: showFrom
                              ? `${theme.palette.success.main}14`
                              : `${theme.palette.text.primary}08`,
                            color: showFrom
                              ? theme.palette.success.main
                              : theme.palette.text.secondary,
                            border: showFrom ? 'none' : `1px solid ${theme.palette.divider}`,
                            fontSize: 12,
                            fontWeight: showFrom ? 600 : 400,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          })}
                          title={String(to ?? '')}
                        >
                          {String(to)}
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            ) : null}

            {triggeredBy?.userName ? (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {HISTORY_AUDIT_DETAIL_TEXT.TRIGGERED_BY_LABEL}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {triggeredBy.userName}
                </Typography>
                {triggeredBy.action ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {`(${triggeredBy.action})`}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            {contextualDetails.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                {contextualDetails.map((item, idx) => (
                  <Box
                    key={`${data.id}-ctx-${idx}`}
                    sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, minWidth: 0 }}
                    title={`${detailLabelForKey(item.key)}${HISTORY_AUDIT_DETAIL_TEXT.KEY_VALUE_SEPARATOR}${item.value}`}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {`${detailLabelForKey(item.key)}${HISTORY_AUDIT_DETAIL_TEXT.KEY_VALUE_SEPARATOR}`}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        minWidth: 0,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
