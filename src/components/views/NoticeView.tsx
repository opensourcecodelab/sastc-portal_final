import React from 'react';
import { NoticeItem, DeptCode } from '../../types';
import { NoticeCard } from '../NoticeCard';

interface NoticeViewProps {
  masterDataset: NoticeItem[];
  deptPreference: DeptCode;
  onOpenNotice: (url: string, title: string, textContent?: string) => void;
  onShare: (url: string, title: string) => void;
}

export const NoticeView: React.FC<NoticeViewProps> = ({
  masterDataset,
  deptPreference,
  onOpenNotice,
  onShare
}) => {
  let filtered = masterDataset.filter(item => !item._isResult);

  if (deptPreference !== "ALL") {
    filtered = filtered.filter(item => item._deptCode === deptPreference);
  }

  return (
    <section id="view-notice" className="tab-view active">
      <div id="noticeList" className="notice-list" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="state-box">
            <i className="fa-regular fa-folder-open"></i>
            <span>No notices found.</span>
          </div>
        ) : (
          filtered.map((item, idx) => (
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
