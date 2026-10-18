import React from 'react';
import { NoticeItem, DeptCode } from '../../types';
import { NoticeCard } from '../NoticeCard';

interface ResultViewProps {
  masterDataset: NoticeItem[];
  deptPreference: DeptCode;
  onOpenNotice: (url: string, title: string, textContent?: string) => void;
  onShare: (url: string, title: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  masterDataset,
  deptPreference,
  onOpenNotice,
  onShare
}) => {
  let results = masterDataset.filter(item => {
    if (!item._isResult) return false;
    const text = `${item.title || ''} ${item.department || ''} ${item.category || ''}`.toUpperCase();
    return /\bSASTC\b/i.test(text);
  });

  if (deptPreference !== "ALL") {
    results = results.filter(item => {
      const text = `${item.title || ''} ${item.department || ''} ${item.category || ''}`.toUpperCase();
      return new RegExp(`\\b${deptPreference}\\b`, "i").test(text);
    });
  }

  return (
    <section id="view-result" className="tab-view active">
      <div id="resultList" className="notice-list">
        {results.length === 0 ? (
          <div className="state-box">
            <i className="fa-solid fa-square-poll-vertical"></i>
            <span>No SASTC examination results published for {deptPreference}.</span>
          </div>
        ) : (
          results.map((item, idx) => (
            <NoticeCard
              key={item._key || idx}
              item={item}
              onOpenNotice={onOpenNotice}
              onShare={onShare}
            />
          ))
        )}
      </div>
    </section>
  );
};
