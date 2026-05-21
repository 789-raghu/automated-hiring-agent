import React from 'react';
import './CandidateCard.css';
import { Card } from '../../common/Card/Card';
import { Avatar } from '../../common/Avatar/Avatar';
import { StatusBadge } from '../../common/Badge/Badge';
import type { ApplicationStatus } from '../../common/Badge/Badge';
import { ScoreRing } from '../ScoreRing/ScoreRing';

export interface CandidateCardProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  experience: string;
  skills: string[];
  status: ApplicationStatus;
  matchScore: number;
  appliedAt: string;
  onClick?: () => void;
  selected?: boolean;
  onShortlist?: () => void;
  onReject?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  email,
  avatarUrl,
  role,
  experience,
  skills,
  status,
  matchScore,
  appliedAt,
  onClick,
  selected,
  onShortlist,
  onReject,
}) => (
  <Card hoverable={!!onClick} selected={selected} onClick={onClick} padding="md">
    <div className="candidate-card">
      <div className="candidate-card__header">
        <div className="candidate-card__identity">
          <Avatar src={avatarUrl} name={name} size="md" />
          <div>
            <h3 className="candidate-card__name">{name}</h3>
            <p className="candidate-card__email">{email}</p>
          </div>
        </div>
        <ScoreRing score={matchScore} size={52} />
      </div>

      <div className="candidate-card__info">
        <span className="candidate-card__info-item">{role}</span>
        <span className="candidate-card__sep">·</span>
        <span className="candidate-card__info-item">{experience}</span>
      </div>

      <div className="candidate-card__skills">
        {skills.slice(0, 4).map((skill) => (
          <span key={skill} className="candidate-card__skill">
            {skill}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="candidate-card__skill candidate-card__skill--more">
            +{skills.length - 4}
          </span>
        )}
      </div>

      <div className="candidate-card__footer">
        <div className="candidate-card__footer-left">
          <StatusBadge status={status} />
          <span className="candidate-card__date">Applied {appliedAt}</span>
        </div>
        {(onShortlist || onReject) && (
          <div className="candidate-card__actions" onClick={(e) => e.stopPropagation()}>
            {onShortlist && (
              <button className="candidate-card__action candidate-card__action--approve" onClick={onShortlist} title="Shortlist">
                <CheckIcon />
              </button>
            )}
            {onReject && (
              <button className="candidate-card__action candidate-card__action--reject" onClick={onReject} title="Reject">
                <XIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </Card>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
