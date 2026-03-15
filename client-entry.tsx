import React from 'react';
import { createRoot } from 'react-dom/client';
import Panel from './src/components/Panel';

const PLUGIN_ID = 'growi-plugin-bookshelf-map';
const SIDEBAR_BTN_ID = 'grw-bookshelf-sidebar-btn';
const PANEL_ROOT_ID = 'grw-bookshelf-panel-root';

function getSidebarContainer(): HTMLElement | null {
  return document.querySelector('.grw-sidebar-nav, .grw-sidebar-content, [class*="sidebar"]') || document.querySelector('.sidebar');
}

function ensurePanelRoot(): HTMLDivElement {
  let root = document.getElementById(PANEL_ROOT_ID) as HTMLDivElement | null;
  if (!root) {
    root = document.createElement('div');
    root.id = PANEL_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
}

function addSidebarButton(): void {
  if (document.getElementById(SIDEBAR_BTN_ID)) return;
  const container = getSidebarContainer();
  if (!container) return;
  const btn = document.createElement('button');
  btn.id = SIDEBAR_BTN_ID;
  btn.type = 'button';
  btn.className = 'btn btn-outline-secondary grw-bookshelf-sidebar-btn';
  btn.innerHTML = '📚 本棚';
  btn.setAttribute('aria-label', '本棚ビューを開く');
  btn.style.marginTop = '0.5rem';
  btn.style.marginLeft = '0.25rem';
  btn.style.marginRight = '0.25rem';
  container.insertBefore(btn, container.firstChild);
  btn.addEventListener('click', openPanel);
}

function openPanel(): void {
  const rootEl = ensurePanelRoot();
  rootEl.innerHTML = '';
  const root = createRoot(rootEl);
  root.render(
    React.createElement(Panel, {
      onClose: () => {
        root.unmount();
        rootEl.innerHTML = '';
      },
    })
  );
}

function removeSidebarButton(): void {
  document.getElementById(SIDEBAR_BTN_ID)?.remove();
}

function removePanelRoot(): void {
  document.getElementById(PANEL_ROOT_ID)?.remove();
}

const activate = (): void => {
  if (typeof window === 'undefined') return;
  addSidebarButton();
};

const deactivate = (): void => {
  removeSidebarButton();
  removePanelRoot();
};

declare global {
  interface Window {
    pluginActivators?: Record<string, { activate: () => void; deactivate: () => void }>;
  }
}

if (typeof window !== 'undefined') {
  if (window.pluginActivators == null) window.pluginActivators = {};
  window.pluginActivators[PLUGIN_ID] = { activate, deactivate };
}
