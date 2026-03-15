import type { PagesListResponse, GrowiPage } from './types';

/** 指定パスの直下の子のみにフィルタ（list API は配下全体を返すことがあるため） */
export function filterDirectChildren(pages: GrowiPage[], parentPath: string): GrowiPage[] {
  return pages.filter((p) => {
    const path = p.path || '';
    if (path === parentPath) return false;
    const prefix = parentPath === '/' ? '/' : parentPath.replace(/\/$/, '') + '/';
    if (!path.startsWith(prefix)) return false;
    const rest = path.slice(prefix.length);
    return rest !== '' && !rest.includes('/');
  });
}

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
 * GROWI API v3: パスで単一ページを取得（リンクプレビュー・グラフ用）
 */
export async function fetchPageByPath(path: string): Promise<GrowiPage | null> {
  const normalized = path.replace(/^\//, '') || '';
  const query = new URLSearchParams({ path: '/' + normalized });
  const url = `${BASE}/_api/v3/page?${query}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.page ?? data ?? null;
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
  if (m) {
    const raw = m[1];
    return '/' + raw.split('/').map((s) => decodeURIComponent(s)).join('/');
  }
  return '/';
}

/**
 * ページパスから GROWI のページ URL を生成（セグメントごとにエンコード）
 * 例: /E = MF²/foo → origin/page/E%20=%20MF%C2%B2/foo
 */
export function buildPageUrl(path: string): string {
  if (typeof window === 'undefined') return '';
  const segments = path.split('/').filter((s) => s !== undefined);
  const encoded = segments.map((s) => encodeURIComponent(s)).join('/');
  return `${window.location.origin}/page/${encoded}`;
}
