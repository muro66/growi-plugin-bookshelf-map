import React from 'react';
import BookshelfView from './BookshelfView';
import { getCurrentPath } from '../api';
import './Panel.css';

interface PanelProps {
  onClose: () => void;
}

export default function Panel({ onClose }: PanelProps) {
  const initialPath = getCurrentPath();
  const [pathStack, setPathStack] = React.useState<string[]>([initialPath]);
  const rootPath = pathStack[pathStack.length - 1] ?? '/';

  const goToShelf = React.useCallback((path: string) => {
    setPathStack((prev) => [...prev, path]);
  }, []);

  const goBack = React.useCallback(() => {
    setPathStack((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  }, []);

  const goRoot = React.useCallback(() => {
    setPathStack(['/']);
  }, []);

  const canGoBack = pathStack.length > 1;

  return (
    <div className="grw-bookshelf-panel" role="dialog" aria-label="本棚ビュー">
      <header className="grw-bookshelf-panel-header">
        <span className="grw-bookshelf-panel-title">本棚</span>
        <div className="grw-bookshelf-panel-actions">
          {canGoBack && (
            <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-back" onClick={goBack}>
              戻る
            </button>
          )}
          <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-root" onClick={goRoot}>
            ルート
          </button>
          <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-close" onClick={onClose}>
            閉じる
          </button>
        </div>
      </header>
      <div className="grw-bookshelf-panel-body">
        <BookshelfView rootPath={rootPath} onOpenShelf={goToShelf} />
      </div>
    </div>
  );
}
