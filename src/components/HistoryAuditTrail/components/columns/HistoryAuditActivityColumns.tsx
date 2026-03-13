import { Avatar, Box, Typography } from '@mui/material';
import { Badge } from '../../../Badge';

import { BotIcon, HistoryAuditTrailIconForType } from '../HistoryAuditTrailIcons';

import {
  detailLabelForKey,
  extractTriggeredBy,
  getHistoryAuditAvatarStyle,
  isNonEmptyString,
  isTriggeredByKey,
  sortContextualDetails,
} from '../../utils';
import { HISTORY_AUDIT_DETAIL_TEXT, HISTORY_AUDIT_LAYOUT } from '../../constants';
import {
  getHistoryAuditAvatarStyles,
  getHistoryAuditTimelineColumnStyles,
  getHistoryAuditTimelineLineStyles,
  getHistoryAuditToValueStyles,
  historyAuditActionTextStyles,
  historyAuditActivityBodyStyles,
  historyAuditActivityMetaRowStyles,
  historyAuditActivityRootStyles,
  historyAuditActorStyles,
  historyAuditArrowStyles,
  historyAuditCreatedByStyles,
  historyAuditContextDetailItemStyles,
  historyAuditContextDetailKeyStyles,
  historyAuditContextDetailValueStyles,
  historyAuditContextDetailsWrapStyles,
  historyAuditDetailsBoxStyles,
  historyAuditDetailsSectionStyles,
  historyAuditFieldChangeRowStyles,
  historyAuditFieldChangesListStyles,
  historyAuditFieldLabelStyles,
  historyAuditFromValueStyles,
  historyAuditSmallBadgeStyles,
  historyAuditTriggeredByActionStyles,
  historyAuditTriggeredByLabelStyles,
  historyAuditTriggeredByRowStyles,
  historyAuditTriggeredByValueStyles,
} from './styles';

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
  const overlap = HISTORY_AUDIT_LAYOUT.TIMELINE_OVERLAP;

  const normalizedAdditionalDetails = (data.event.additionalDetails ?? [])
    .filter((i) => isNonEmptyString(i?.key) && isNonEmptyString(i?.value))
    .map((i) => ({ key: i.key.trim(), value: i.value.trim() }));

  const triggeredBy = extractTriggeredBy(normalizedAdditionalDetails);
  const contextualDetails = sortContextualDetails(
    normalizedAdditionalDetails.filter((i) => !isTriggeredByKey(i.key)),
  );

  const detailsText = isNonEmptyString(data.event.details) ? data.event.details : null;
  const createdByText = isNonEmptyString(data.event.createdBy) ? data.event.createdBy.trim() : null;

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
    <Box sx={historyAuditActivityRootStyles}>
      <Box sx={getHistoryAuditTimelineColumnStyles(avatarSize)}>
        <Box sx={getHistoryAuditTimelineLineStyles(center, isFirst, isLast, overlap)} />

        <Avatar
          sx={getHistoryAuditAvatarStyles(
            avatarSize,
            getHistoryAuditAvatarStyle(data.event.auditEventType),
            actionStyle,
          )}
        >
          {isSystemActivity ? (
            <BotIcon />
          ) : (
            (actionStyle?.icon ?? <HistoryAuditTrailIconForType type={data.event.auditEventType} />)
          )}
        </Avatar>
      </Box>

      <Box sx={historyAuditActivityBodyStyles}>
        <Box sx={historyAuditActivityMetaRowStyles}>
          <Typography variant="subtitle2" sx={historyAuditActorStyles} noWrap title={data.actor}>
            {data.actor}
          </Typography>
          {data.badge ? (
            <Badge
              label={data.badge}
              size="small"
              variant="filled"
              color="neutral"
              sx={historyAuditSmallBadgeStyles}
            />
          ) : null}
          {data.moduleBadge ? (
            <Badge
              label={data.moduleBadge}
              size="small"
              variant="outlined"
              color={data.moduleBadgeColor ?? 'neutral'}
              sx={historyAuditSmallBadgeStyles}
            />
          ) : null}
        </Box>

        <Typography variant="body2" sx={historyAuditActionTextStyles}>
          {data.action}
        </Typography>

        {createdByText ? (
          <Typography variant="caption" sx={historyAuditCreatedByStyles}>
            {`${HISTORY_AUDIT_DETAIL_TEXT.CREATED_BY_LABEL} ${createdByText}`}
          </Typography>
        ) : null}

        {hasDetailSection ? (
          <Box sx={historyAuditDetailsSectionStyles}>
            {detailsText ? <Box sx={historyAuditDetailsBoxStyles}>{detailsText}</Box> : null}

            {resolvedChanges.length > 0 ? (
              <Box sx={historyAuditFieldChangesListStyles}>
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
                    <Box key={`${data.id}-change-${idx}`} sx={historyAuditFieldChangeRowStyles}>
                      {fieldLabel ? (
                        <Typography variant="caption" sx={historyAuditFieldLabelStyles}>
                          {`${HISTORY_AUDIT_DETAIL_TEXT.FIELD_LABEL_PREFIX} ${fieldLabel}`}
                        </Typography>
                      ) : null}

                      {showFrom ? (
                        <Box sx={historyAuditFromValueStyles} title={String(from ?? '')}>
                          {String(from)}
                        </Box>
                      ) : null}

                      {showFrom && showTo ? (
                        <Typography variant="body2" sx={historyAuditArrowStyles}>
                          {HISTORY_AUDIT_DETAIL_TEXT.CHANGE_ARROW}
                        </Typography>
                      ) : null}

                      {showTo ? (
                        <Box sx={getHistoryAuditToValueStyles(showFrom)} title={String(to ?? '')}>
                          {String(to)}
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            ) : null}

            {triggeredBy?.userName ? (
              <Box sx={historyAuditTriggeredByRowStyles}>
                <Typography variant="caption" sx={historyAuditTriggeredByLabelStyles}>
                  {HISTORY_AUDIT_DETAIL_TEXT.TRIGGERED_BY_LABEL}
                </Typography>
                <Typography variant="caption" sx={historyAuditTriggeredByValueStyles}>
                  {triggeredBy.userName}
                </Typography>
                {triggeredBy.action ? (
                  <Typography variant="caption" sx={historyAuditTriggeredByActionStyles}>
                    {`(${triggeredBy.action})`}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            {contextualDetails.length > 0 ? (
              <Box sx={historyAuditContextDetailsWrapStyles}>
                {contextualDetails.map((item, idx) => (
                  <Box
                    key={`${data.id}-ctx-${idx}`}
                    sx={historyAuditContextDetailItemStyles}
                    title={`${detailLabelForKey(item.key)}${HISTORY_AUDIT_DETAIL_TEXT.KEY_VALUE_SEPARATOR}${item.value}`}
                  >
                    <Typography variant="caption" sx={historyAuditContextDetailKeyStyles}>
                      {`${detailLabelForKey(item.key)}${HISTORY_AUDIT_DETAIL_TEXT.KEY_VALUE_SEPARATOR}`}
                    </Typography>
                    <Typography variant="caption" sx={historyAuditContextDetailValueStyles}>
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
