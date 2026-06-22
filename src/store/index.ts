import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Creator, CreatorRanking, CommissionRule } from '@/types/creator';
import type { Settlement } from '@/types/settlement';
import type { Dispute, DisputeStatus } from '@/types/dispute';
import type { Payment } from '@/types/payment';
import { mockCreators, mockCreatorRankings } from '@/data/creators';
import { mockSettlements, getPendingSettlements } from '@/data/settlements';
import { mockDisputes } from '@/data/disputes';
import { mockPayments } from '@/data/payments';

interface AppState {
  creators: Creator[];
  creatorRankings: CreatorRanking[];
  settlements: Settlement[];
  disputes: Dispute[];
  payments: Payment[];

  getCreatorById: (id: string) => Creator | undefined;
  getSettlementById: (id: string) => Settlement | undefined;
  getDisputeById: (id: string) => Dispute | undefined;
  getPendingSettlementCount: () => number;
  getPendingDisputeCount: () => number;

  updateCommissionRule: (creatorId: string, rule: CommissionRule) => void;
  confirmSettlement: (settlementId: string) => void;
  returnSettlementToDispute: (
    settlementId: string,
    reason: string,
    requiredEvidence: string[]
  ) => void;
  returnDispute: (
    disputeId: string,
    reason: string,
    requiredEvidence: string[]
  ) => void;
  resolveDispute: (disputeId: string) => void;
  confirmPayment: (paymentId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      creators: mockCreators,
      creatorRankings: mockCreatorRankings,
      settlements: mockSettlements,
      disputes: mockDisputes,
      payments: mockPayments,

      getCreatorById: (id) => get().creators.find((c) => c.id === id),
      getSettlementById: (id) => get().settlements.find((s) => s.id === id),
      getDisputeById: (id) => get().disputes.find((d) => d.id === id),
      getPendingSettlementCount: () =>
        get().settlements.filter((s) => s.status === 'pending').length,
      getPendingDisputeCount: () =>
        get().disputes.filter((d) => d.status === 'pending').length,

      updateCommissionRule: (creatorId, rule) =>
        set((state) => {
          const updatedCreators = state.creators.map((c) =>
            c.id === creatorId ? { ...c, commissionRule: rule } : c
          );

          const updatedRankings = state.creatorRankings.map((r) => {
            const creator = updatedCreators.find((c) => c.id === r.creatorId);
            if (!creator) return r;

            let estimatedCommission = 0;
            if (rule.type === 'fixed' && rule.fixedAmount) {
              estimatedCommission = rule.fixedAmount * creator.monthlyData.dealCount;
            } else if (rule.type === 'per_order' && rule.percentage) {
              estimatedCommission = creator.monthlyData.totalRevenue * rule.percentage;
            } else if (rule.type === 'tiered' && rule.tiers) {
              const revenue = creator.monthlyData.totalRevenue;
              let percentage = 0;
              rule.tiers.forEach((tier) => {
                if (revenue >= tier.threshold) percentage = tier.percentage;
              });
              estimatedCommission = revenue * percentage;
            }

            const newRoiValue = estimatedCommission > 0
              ? Number((creator.monthlyData.totalRevenue / estimatedCommission).toFixed(1))
              : r.roiValue;
            const newRoi = newRoiValue >= 3 ? 'high' : newRoiValue >= 1.5 ? 'medium' : 'low';

            return {
              ...r,
              roi: newRoi,
              roiValue: newRoiValue,
            };
          });

          return {
            creators: updatedCreators,
            creatorRankings: updatedRankings,
          };
        }),

      confirmSettlement: (settlementId) =>
        set((state) => {
          const settlement = state.settlements.find((s) => s.id === settlementId);
          if (!settlement) return {};

          const updatedSettlements = state.settlements.map((s) =>
            s.id === settlementId
              ? {
                  ...s,
                  status: 'confirmed' as const,
                  confirmDate: new Date().toISOString().split('T')[0],
                }
              : s
          );

          const updatedCreators = state.creators.map((c) => {
            if (c.id !== settlement.creatorId) return c;
            const updatedHistory = c.settlementHistory.map((h) =>
              h.id === settlementId ? { ...h, status: 'confirmed' as const } : h
            );
            return { ...c, settlementHistory: updatedHistory };
          });

          const existingHistory = updatedCreators.find(
            (c) => c.id === settlement.creatorId
          )?.settlementHistory;

          if (!existingHistory?.find((h) => h.id === settlementId)) {
            const creatorsWithNewHistory = state.creators.map((c) => {
              if (c.id !== settlement.creatorId) return c;
              return {
                ...c,
                settlementHistory: [
                  {
                    id: settlement.id,
                    month: settlement.periodStart.slice(0, 7),
                    customerCount: settlement.customerCount,
                    dealCount: settlement.dealCount,
                    totalAmount: settlement.totalAmount,
                    commission: settlement.commission,
                    status: 'confirmed' as const,
                  },
                  ...c.settlementHistory,
                ],
              };
            });
            return { settlements: updatedSettlements, creators: creatorsWithNewHistory };
          }

          return { settlements: updatedSettlements, creators: updatedCreators };
        }),

      returnSettlementToDispute: (settlementId, reason, requiredEvidence) =>
        set((state) => {
          const settlement = state.settlements.find((s) => s.id === settlementId);
          if (!settlement) return {};

          const updatedSettlements = state.settlements.map((s) =>
            s.id === settlementId ? { ...s, status: 'disputed' as const } : s
          );

          const newDispute: Dispute = {
            id: `dispute-${Date.now()}`,
            settlementId: settlementId,
            creatorId: settlement.creatorId,
            creatorName: settlement.creatorName,
            creatorAvatar: settlement.creatorAvatar,
            type: 'other',
            typeLabel: '结算退回',
            description: reason,
            status: 'returned',
            statusLabel: '已退回',
            raiseDate: new Date().toISOString().split('T')[0],
            raiseBy: '老板',
            returnDate: new Date().toISOString().split('T')[0],
            evidence: [],
            currentHandler: '市场人员',
            disputedAmount: settlement.commission,
            remark: `需补充材料：${requiredEvidence.join('、')}`,
          };

          return {
            settlements: updatedSettlements,
            disputes: [newDispute, ...state.disputes],
          };
        }),

      returnDispute: (disputeId, reason, requiredEvidence) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status: 'returned' as DisputeStatus,
                  statusLabel: '已退回',
                  returnDate: new Date().toISOString().split('T')[0],
                  description: reason,
                  remark: `需补充材料：${requiredEvidence.join('、')}`,
                  currentHandler: '市场人员',
                }
              : d
          ),
        })),

      resolveDispute: (disputeId) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status: 'resolved' as DisputeStatus,
                  statusLabel: '已解决',
                  resolveDate: new Date().toISOString().split('T')[0],
                }
              : d
          ),
        })),

      confirmPayment: (paymentId) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId
              ? {
                  ...p,
                  status: 'success',
                  paidDate: new Date().toISOString().split('T')[0],
                }
              : p
          ),
        })),
    }),
    {
      name: 'aesthetic-creator-app-storage',
    }
  )
);
