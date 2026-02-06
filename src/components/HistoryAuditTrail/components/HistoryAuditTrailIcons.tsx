import {
  History as HistoryIconLucide,
  Info as InfoIconLucide,
  Pencil as EditIconLucide,
  Plus as PlusIconLucide,
  Trash2 as TrashIconLucide,
  X as CloseIconLucide,
} from 'lucide-react';

import { HISTORY_AUDIT_EVENT_TYPES } from '../constants';

export const HistoryIcon = () => <HistoryIconLucide size={16} />;
export const CloseIcon = () => <CloseIconLucide size={16} />;
export const PlusIcon = () => <PlusIconLucide size={16} />;
export const EditIcon = () => <EditIconLucide size={16} />;
export const TrashIcon = () => <TrashIconLucide size={16} />;
export const InfoIcon = () => <InfoIconLucide size={16} />;

export const HistoryAuditTrailIconForType = ({ type }: { type: string }) => {
  switch (type) {
    case HISTORY_AUDIT_EVENT_TYPES.CREATED:
    case HISTORY_AUDIT_EVENT_TYPES.ADDED:
      return <PlusIcon />;
    case HISTORY_AUDIT_EVENT_TYPES.UPDATED:
      return <EditIcon />;
    case HISTORY_AUDIT_EVENT_TYPES.DELETED:
    case HISTORY_AUDIT_EVENT_TYPES.REMOVED:
      return <TrashIcon />;
    case HISTORY_AUDIT_EVENT_TYPES.OTHER:
      return <InfoIcon />;
    default:
      return <EditIcon />;
  }
};
