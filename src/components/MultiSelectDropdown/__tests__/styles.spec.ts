import { describe, expect, it } from 'vitest';

import {
  getMultiSelectActionIconStyles,
  getMultiSelectClearButtonStyles,
  getMultiSelectControlsRowStyles,
  getMultiSelectEmptyStateStyles,
  getMultiSelectHeaderStyles,
  getMultiSelectListStyles,
  getMultiSelectOptionStyles,
  getMultiSelectPopoverPaperStyles,
  getMultiSelectTriggerLabelStyles,
  getMultiSelectTriggerStyles,
} from '../styles';

describe('styles', () => {
  describe('getMultiSelectTriggerStyles', () => {
    it('returns a function (theme-aware sx)', () => {
      expect(typeof getMultiSelectTriggerStyles()).toBe('function');
    });

    it('returns a function when disabled=true', () => {
      expect(typeof getMultiSelectTriggerStyles(true)).toBe('function');
    });
  });

  describe('getMultiSelectTriggerLabelStyles', () => {
    it('returns a function', () => {
      expect(typeof getMultiSelectTriggerLabelStyles()).toBe('function');
    });
  });

  describe('getMultiSelectPopoverPaperStyles', () => {
    it('returns a function', () => {
      expect(typeof getMultiSelectPopoverPaperStyles()).toBe('function');
    });
  });

  describe('getMultiSelectHeaderStyles', () => {
    it('returns a function', () => {
      expect(typeof getMultiSelectHeaderStyles()).toBe('function');
    });
  });

  describe('getMultiSelectControlsRowStyles', () => {
    it('returns a function', () => {
      expect(typeof getMultiSelectControlsRowStyles()).toBe('function');
    });
  });

  describe('getMultiSelectActionIconStyles', () => {
    it('returns a function when active=false', () => {
      expect(typeof getMultiSelectActionIconStyles(false)).toBe('function');
    });

    it('returns a function when active=true', () => {
      expect(typeof getMultiSelectActionIconStyles(true)).toBe('function');
    });
  });

  describe('getMultiSelectListStyles', () => {
    it('returns an object', () => {
      expect(typeof getMultiSelectListStyles()).toBe('object');
    });
  });

  describe('getMultiSelectOptionStyles', () => {
    it('returns a function when unchecked', () => {
      expect(typeof getMultiSelectOptionStyles(false)).toBe('function');
    });

    it('returns a function when checked', () => {
      expect(typeof getMultiSelectOptionStyles(true)).toBe('function');
    });
  });

  describe('getMultiSelectEmptyStateStyles', () => {
    it('returns an object', () => {
      expect(typeof getMultiSelectEmptyStateStyles()).toBe('object');
    });
  });

  describe('getMultiSelectClearButtonStyles', () => {
    it('returns a function', () => {
      expect(typeof getMultiSelectClearButtonStyles()).toBe('function');
    });
  });
});
