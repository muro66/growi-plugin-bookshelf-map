import type { PagesListResponse } from './types';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

/**
 * GROWI API v3: 指定パス配下のページ一覧を取得
 */
export async function fetchPagesUnderPath(path: string): Promise<PagesListResponse> {
  const normalized = path.replace(/^\//, '') || '';
  const query = new URLSearchParams({ path: '/' + normalized });
  const url = `${BASE}/_api/v3/pages/list?${query}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return { pages: data.pages ?? [], totalCount: data.totalCount };
}

/**
 * 現在表示中のページパスを取得（DOM または URL から推測）
 */
export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  const doc = document;
  const el = doc.querySelector('[data-page-path]') as HTMLElement | null;
  if (el?.dataset?.pagePath) return el.dataset.pagePath;
  const meta = doc.querySelector('meta[property="growi:path"]') as HTMLMetaElement | null;
  if (meta?.content) return meta.content;
  const m = window.location.pathname.match(/^\/page\/(.+)$/);
  if (m) return '/' + decodeURIComponent(m[1]);
  return '/';
}
