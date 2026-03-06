import '@testing-library/jest-dom/vitest';
import React, { isValidElement } from 'react';
import { act, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DOCUMENT_TEMPLATE_CARD_ACTION_TYPES } from '../constants';
import { useDocumentTemplateCard } from '../useDocumentTemplateCard';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {
    ResizeObserverMock.instances.push(this);
  }
}

describe('useDocumentTemplateCard', () => {
  beforeEach(() => {
    ResizeObserverMock.instances = [];
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves normalized type, label, and file kind', () => {
    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: ' Template ',
        label: 'Template',
        fileName: 'template-file.pdf',
      }),
    );

    expect(result.current.normalizedType).toBe('template');
    expect(result.current.cardLabel).toBe('Template');
    expect(result.current.fileKind).toBe('document');
  });

  it('handles card click callback', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: 'Cover Letter',
        fileName: 'cover.pdf',
        onClick,
      }),
    );

    act(() => {
      result.current.handleCardClick();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maps default actions with default icons and labels', () => {
    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: 'Addendum',
        fileName: 'addendum.pdf',
        actions: [
          { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SWAP },
          { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.DELETE },
          { type: DOCUMENT_TEMPLATE_CARD_ACTION_TYPES.SETTINGS },
        ],
      }),
    );

    expect(result.current.actions).toHaveLength(3);
    expect(result.current.actions[0].ariaLabel).toBe('Swap card position');
    expect(result.current.actions[1].ariaLabel).toBe('Delete document');
    expect(result.current.actions[2].ariaLabel).toBe('Open template settings');
    expect(isValidElement(result.current.actions[0].icon)).toBe(true);
  });

  it('uses custom icon/aria and passes action callback context', () => {
    const onActionClick = vi.fn();
    const customIcon = <span data-testid="custom-icon">X</span>;

    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: 'Cover Letter',
        label: 'Cover Letter',
        fileName: 'cover.pdf',
        selected: true,
        actions: [
          {
            type: 'custom',
            icon: customIcon,
            ariaLabel: 'Custom action',
            onClick: onActionClick,
          },
        ],
      }),
    );

    const action = result.current.actions[0];
    expect(action.ariaLabel).toBe('Custom action');
    expect(isValidElement(action.icon)).toBe(true);
    expect((action.icon as React.ReactElement).props['data-testid']).toBe('custom-icon');

    const stopPropagation = vi.fn();
    act(() => {
      action.onClick({ stopPropagation } as unknown as React.MouseEvent<HTMLButtonElement>);
    });

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onActionClick).toHaveBeenCalledTimes(1);
    expect(onActionClick.mock.calls[0][0]).toMatchObject({
      cardType: 'Cover Letter',
      label: 'Cover Letter',
      fileName: 'cover.pdf',
      selected: true,
      actionType: 'custom',
    });
  });

  it('tracks file name overflow state', () => {
    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: 'Cover Letter',
        fileName: 'very-long-file-name.pdf',
      }),
    );

    const node = document.createElement('p');
    Object.defineProperty(node, 'scrollWidth', { configurable: true, value: 200 });
    Object.defineProperty(node, 'clientWidth', { configurable: true, value: 100 });

    act(() => {
      result.current.fileNameRef(node);
    });
    expect(result.current.showFileNameTooltip).toBe(true);

    Object.defineProperty(node, 'scrollWidth', { configurable: true, value: 100 });
    Object.defineProperty(node, 'clientWidth', { configurable: true, value: 100 });
    act(() => {
      result.current.fileNameRef(node);
    });
    expect(result.current.showFileNameTooltip).toBe(false);

    act(() => {
      result.current.fileNameRef(null);
    });
    expect(result.current.showFileNameTooltip).toBe(false);
  });

  it('creates and disconnects ResizeObserver when ref node exists during render', () => {
    const Probe = () => {
      const { fileNameRef } = useDocumentTemplateCard({
        type: 'Cover Letter',
        fileName: 'cover.pdf',
      });
      return <p ref={fileNameRef}>Cover</p>;
    };

    const { unmount } = render(<Probe />);
    expect(ResizeObserverMock.instances.length).toBeGreaterThan(0);
    expect(ResizeObserverMock.instances[0].observe).toHaveBeenCalledTimes(1);

    unmount();
    expect(ResizeObserverMock.instances[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it('skips ResizeObserver setup when API is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined as unknown as typeof ResizeObserver);

    const { result } = renderHook(() =>
      useDocumentTemplateCard({
        type: 'Cover Letter',
        fileName: 'cover.pdf',
      }),
    );

    act(() => {
      result.current.fileNameRef(document.createElement('p'));
    });

    expect(result.current.showFileNameTooltip).toBe(false);
  });
});
