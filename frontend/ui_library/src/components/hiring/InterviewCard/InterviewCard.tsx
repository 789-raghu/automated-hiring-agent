import React from 'react';
import './InterviewCard.css';
import { Avatar } from '../../common/Avatar/Avatar';
import { Badge } from '../../common/Badge/Badge';
import type { BadgeVariant } from '../../common/Badge/Badge';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Interviewer {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface InterviewCardProps {
  id: string;
  candidateName: string;
  candidateAvatarUrl?: string;
  role: string;
  type: InterviewType;
  status: InterviewStatus;
  date: string;
  time: string;
  duration: string;
  interviewers: Interviewer[];
  meetLink?: string;
  notes?: string;
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  className?: string;
}

const interviewTypeLabel: Record<InterviewType, string> = {
  phone: 'Phone Screen',
  video: 'Video Call',
  onsite: 'On-site',
  technical: 'Technical',
  hr: 'HR Round',
};

const interviewTypeIcon: Record<InterviewType, React.ReactNode> = {
  phone: <PhoneIcon />,
  video: <VideoIcon />,
  onsite: <BuildingIcon />,
  technical: <CodeIcon />,
  hr: <PersonIcon />,
};

const statusVariant: Record<InterviewStatus, BadgeVariant> = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger',
  rescheduled: 'warning',
};

export const InterviewCard: React.FC<InterviewCardProps> = ({
  candidateName,
  candidateAvatarUrl,
  role,
  type,
  status,
  date,
  time,
  duration,
  interviewers,
  meetLink,
  notes,
  onJoin,
  onReschedule,
  onCancel,
  className = '',
}) => (
  <div className={`interview-card ${className}`}>
    <div className="interview-card__stripe" />
    <div className="interview-card__body">
      <div className="interview-card__top">
        <div className="interview-card__type">
          <span className="interview-card__type-icon">{interviewTypeIcon[type]}</span>
          <span className="interview-card__type-label">{interviewTypeLabel[type]}</span>
        </div>
        <Badge variant={statusVariant[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="interview-card__candidate">
        <Avatar src={candidateAvatarUrl} name={candidateName} size="sm" />
        <div>
          <p className="interview-card__name">{candidateName}</p>
          <p className="interview-card__role">{role}</p>
        </div>
      </div>

      <div className="interview-card__schedule">
        <span className="interview-card__schedule-item">
          <CalendarIcon />
          {date}
        </span>
        <span className="interview-card__schedule-item">
          <ClockIcon />
          {time} · {duration}
        </span>
      </div>

      {interviewers.length > 0 && (
        <div className="interview-card__interviewers">
          <span className="interview-card__interviewers-label">Interviewers</span>
          <div className="interview-card__interviewers-list">
            {interviewers.map((iv) => (
              <div key={iv.name} className="interview-card__interviewer">
                <Avatar src={iv.avatarUrl} name={iv.name} size="xs" />
                <span>{iv.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {notes && <p className="interview-card__notes">{notes}</p>}

      {(onJoin || onReschedule || onCancel) && (
        <div className="interview-card__actions">
          {onJoin && meetLink && (
            <button className="interview-card__btn interview-card__btn--join" onClick={onJoin}>
              <VideoIcon /> Join
            </button>
          )}
          {onReschedule && (
            <button className="interview-card__btn interview-card__btn--ghost" onClick={onReschedule}>
              Reschedule
            </button>
          )}
          {onCancel && (
            <button className="interview-card__btn interview-card__btn--danger" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

function PhoneIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.06 6.06l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function VideoIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>;
}
function BuildingIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function CodeIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
}
function PersonIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function CalendarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
