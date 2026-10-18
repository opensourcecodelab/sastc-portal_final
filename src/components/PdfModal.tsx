import React from 'react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  textContent?: string;
}

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  textContent
}) => {
  if (!isOpen) return null;

  const isTextMode = Boolean(textContent);
  let frameUrl = "about:blank";

  if (!isTextMode && url && url !== "#") {
    if (url.endsWith(".pdf") || url.includes("/pdf") || url.includes("drive.google")) {
      frameUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    } else {
      frameUrl = url;
    }
  }

  return (
    <div
      id="pdfModal"
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <span id="modalNoticeTitle" className="modal-title">
            {title || "Notice Document"}
          </span>
          <button
            type="button"
            className="modal-close"
            id="closeModalBtn"
            aria-label="Close preview"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
          {isTextMode ? (
            <div
              id="modalTextContent"
              className="modal-text-content"
              style={{
                display: 'block',
                padding: '24px',
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap'
              }}
              dangerouslySetInnerHTML={{ __html: textContent || '' }}
            />
          ) : (
            <iframe
              id="pdfFrame"
              src={frameUrl}
              title="PDF Notice Viewer"
              style={{ display: 'block' }}
            />
          )}
        </div>

        {!isTextMode && (
          <div className="modal-footer" id="modalFooter" style={{ display: 'flex' }}>
            <a
              id="modalDirectLink"
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span>Open Direct PDF</span> <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
