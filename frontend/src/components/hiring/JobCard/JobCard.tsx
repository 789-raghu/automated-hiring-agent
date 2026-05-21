import React from 'react';
import './JobCard.css';
import { Card } from '../../common/Card/Card';
import { Badge } from '../../common/Badge/Badge';
import type { BadgeVariant } from '../../common/Badge/Badge';
import { Avatar } from '../../common/Avatar/Avatar';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type JobStatus = 'active' | 'paused' | 'closed' | 'draft';

export interface JobCardProps {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  applicantCount: number;
  postedAt: string;
  salary?: string;
  companyLogo?: string;
  companyName?: string;
  onClick?: () => void;
  selected?: boolean;
}

const jobStatusVariant: Record<JobStatus, BadgeVariant> = {
  active: 'success',
  paused: 'warning',
  closed: 'danger',
  draft: 'default',
};

const jobTypeLabel: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export const JobCard: React.FC<JobCardProps> = ({
  title,
  department,
  location,
  type,
  status,
  applicantCount,
  postedAt,
  salary,
  companyLogo,
  companyName,
  onClick,
  selected,
}) => (
  <Card hoverable={!!onClick} selected={selected} onClick={onClick} padding="md">
    <div className="job-card">
      <div className="job-card__header">
        <div className="job-card__identity">
          {companyName && (
            <Avatar src={companyLogo} name={companyName} size="sm" />
          )}
          <div>
            <h3 className="job-card__title">{title}</h3>
            <p className="job-card__department">{department}</p>
          </div>
        </div>
        <Badge variant={jobStatusVariant[status]} dot>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="job-card__meta">
        <span className="job-card__meta-item">
          <LocationIcon />
          {location}
        </span>
        <span className="job-card__meta-item">
          <BriefcaseIcon />
          {jobTypeLabel[type]}
        </span>
        {salary && (
          <span className="job-card__meta-item">
            <MoneyIcon />
            {salary}
          </span>
        )}
      </div>

      <div className="job-card__footer">
        <span className="job-card__applicants">
          <PersonIcon />
          {applicantCount} applicant{applicantCount !== 1 ? 's' : ''}
        </span>
        <span className="job-card__posted">Posted {postedAt}</span>
      </div>
    </div>
  </Card>
);

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const MoneyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
  </svg>
);

const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
