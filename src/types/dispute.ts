export type DisputeStatus = 'pending' | 'returned' | 'resolved' | 'rejected';

export type DisputeType = 'customer' | 'amount' | 'project' | 'other';

export interface DisputeEvidence {
  id: string;
  type: 'image' | 'screenshot' | 'document';
  url: string;
  uploadDate: string;
  uploader: string;
  remark?: string;
}

export interface Dispute {
  id: string;
  settlementId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  type: DisputeType;
  typeLabel: string;
  description: string;
  status: DisputeStatus;
  statusLabel: string;
  raiseDate: string;
  raiseBy: string;
  returnDate?: string;
  resolveDate?: string;
  evidence: DisputeEvidence[];
  currentHandler: string;
  dealItemId?: string;
  projectName?: string;
  disputedAmount: number;
  remark?: string;
}

export interface ReturnDisputeParams {
  disputeId: string;
  reason: string;
  requiredEvidence: string[];
  assignee: string;
}
