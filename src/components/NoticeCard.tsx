import React from 'react';
import { NoticeItem } from '../types';
import {
  detectDeptCode,
  isResultNotice,
  getDeptIcon,
  getTagInfo,
  formatDateString,
  formatPdfUrl
} from '../utils/notices';

interface NoticeCardProps {
  item: NoticeItem;
  hideCopy?: boolean;
  onOpenNotice: (url: string, title: string, textContent?: string) => void;
  onShare: (url: string, title: string) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  item,
  hideCopy = false,
  onOpenNotice,
  onShare
}) => {
  const isResult = item._isResult !== undefined ? item._isResult : isResultNotice(item);
  const displayBadge = isResult
    ? "RESULT"
    : (item._deptCode || detectDeptCode(`${item.department || ''} ${item.title || ''}`));
  const deptIcon = getDeptIcon(displayBadge);

  const rawLink = item.pdf || item.url || item.pdf_url || item.link || item.pdfUrl || "";
  const isTextOnly = !rawLink || rawLink === "#";
  const pdfUrl = isTextOnly ? "#" : formatPdfUrl(rawLink);

  const title = item.title || "Untitled Notice";
  const dateFormatted = formatDateString(item.date) || "N/A";
  const tagInfo = getTagInfo(item.date);

  const rawDesc = item.desc || item.description || item.text || "";
  const textContent = isTextOnly ? (rawDesc || "No detailed description available.") : undefined;

  let linkMatch = rawDesc.match(/href=['"]([^'"]+)['"]/);
  const visitLink = linkMatch ? linkMatch[1] : null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenNotice(pdfUrl, title, textContent);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(pdfUrl, title);
  };

  return (
    <div className="card card-animate visible">
      <div className="card-header">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge-dept">
            <i className={deptIcon}></i> {displayBadge}
          </span>
          {tagInfo && (
            <span className={`badge-time ${tagInfo.className}`}>{tagInfo.text}</span>
          )}
        </div>
        <span className="date">
          <i className="fa-regular fa-calendar"></i> {dateFormatted}
        </span>
      </div>

      <a
        href={pdfUrl}
        className="notice-title"
        onClick={handleClick}
      >
        {title}
      </a>

      {rawDesc && (
        <div
          className="notice-desc-preview"
          dangerouslySetInnerHTML={{ __html: rawDesc }}
        />
      )}

      <div className="card-footer">
        <span className="category-tag">
          <i className="fa-solid fa-tag"></i> {item.category || "General"}
        </span>
        <div className="btn-actions">
          {!hideCopy && (
            <button
              type="button"
              className="btn-share"
              onClick={handleShareClick}
              title="Share Link"
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
          )}

          {visitLink && (
            <a
              href={visitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-visit"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Visit
            </a>
          )}

          <button
            type="button"
            className="btn-view"
            onClick={handleClick}
          >
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
