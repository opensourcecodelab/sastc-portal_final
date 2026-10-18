import React, { useEffect, useState } from 'react';
import { NoticeItem, DeptCode } from '../../types';
import { NoticeCard } from '../NoticeCard';
import { formatPdfUrl } from '../../utils/notices';

interface HomeViewProps {
  masterDataset: NoticeItem[];
  deptPreference: DeptCode;
  onOpenNotice: (url: string, title: string, textContent?: string) => void;
  onShare: (url: string, title: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  masterDataset,
  deptPreference,
  onOpenNotice,
  onShare
}) => {
  const [sastcNotices, setSastcNotices] = useState<NoticeItem[]>([]);
  const [isLoadingSastc, setIsLoadingSastc] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Filter master dataset for hero card based on deptPreference
  const filteredSet = deptPreference === "ALL"
    ? masterDataset
    : masterDataset.filter(item => item._deptCode === deptPreference);

  const heroItem = filteredSet[0] || masterDataset[0];

  useEffect(() => {
    setIsLoadingSastc(true);
    fetch("/sastc-notices.json")
      .then(res => res.json())
      .then((data: NoticeItem[]) => {
        let list = data;
        if (deptPreference !== "ALL") {
          list = data.filter(item => {
            const code = item.deptCode || "SASTC";
            return code === deptPreference || code === "SASTC";
          });
        }
        list.sort((a, b) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        });
        setSastcNotices(list);
        setIsLoadingSastc(false);
      })
      .catch(err => {
        console.error("Failed to load sastc-notices.json", err);
        setHasError(true);
        setIsLoadingSastc(false);
      });
  }, [deptPreference]);

  const handleHeroClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!heroItem) return;
    const rawLink = heroItem.pdf || heroItem.url || heroItem.pdf_url || heroItem.link || heroItem.pdfUrl || "";
    const isTextOnly = !rawLink || rawLink === "#";
    const pdfUrl = isTextOnly ? "#" : formatPdfUrl(rawLink);
    const textContent = isTextOnly ? (heroItem.desc || heroItem.description || heroItem.text || "") : undefined;
    onOpenNotice(pdfUrl, heroItem.title, textContent);
  };

  return (
    <section id="view-home" className="tab-view active">
      {/* Hero Highlight Card */}
      {heroItem ? (
        <div className="hero-card card-animate visible" id="heroLatestCard">
          <div className="hero-badge">
            <i className="fa-solid fa-bolt"></i> Latest Notice
          </div>
          <h3 className="hero-title">{heroItem.title}</h3>
          <p className="hero-desc">
            {heroItem.department || 'HSTU'} • {heroItem.category || 'Notice'}
          </p>
          <span className="hero-date">
            <i className="fa-regular fa-clock"></i> {heroItem.date || 'Recent'}
          </span>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleHeroClick}
            >
              <i className="fa-solid fa-file-pdf"></i> Read Document
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-card card-animate visible">
          <div className="hero-badge">
            <i className="fa-solid fa-bolt"></i> Latest Notice
          </div>
          <h3 className="hero-title">Academic Notice</h3>
          <p className="hero-desc">Loading latest department notice...</p>
          <span className="hero-date">
            <i className="fa-regular fa-clock"></i> Recent
          </span>
        </div>
      )}

      {/* SASTC Notices Section */}
      <div className="section-header">
        <h3>
          <i className="fa-solid fa-building-columns"></i> SASTC Notices only
        </h3>
      </div>

      <div id="sastcNoticeList" className="notice-list">
        {isLoadingSastc ? (
          <div className="state-box">
            <i className="fa-solid fa-circle-notch spinner"></i>
            <span>Loading SASTC notices...</span>
          </div>
        ) : hasError ? (
          <div className="state-box">
            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--accent-red)' }}></i>
            <span>Failed to load SASTC notices.</span>
          </div>
        ) : sastcNotices.length === 0 ? (
          <div className="state-box">
            <i className="fa-regular fa-folder-open"></i>
            <span>No SASTC notices found for {deptPreference !== "ALL" ? deptPreference : "any department"}.</span>
          </div>
        ) : (
          sastcNotices.map((item, idx) => (
            <NoticeCard
              key={item.id || item._key || idx}
              item={item}
              hideCopy={true}
              onOpenNotice={onOpenNotice}
              onShare={onShare}
            />
          ))
        )}
      </div>
    </section>
  );
};
