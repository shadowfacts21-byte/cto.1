import api from '../api/axios';

export interface AutomationRule {
  id: string;
  org_id: string;
  trigger_type: 'task_moved_to_done' | 'task_assigned' | 'due_date_near';
  action_type: 'send_email' | 'post_slack' | 'move_task';
  config: any;
  enabled: boolean;
}

export const automationService = {
  getRules: async (orgSlug: string) => {
    try {
      const response = await api.get(`/orgs/${orgSlug}/automations`);
      return response.data as AutomationRule[];
    } catch (err) {
      // Mock data
      return [
        {
          id: '1',
          org_id: 'org1',
          trigger_type: 'task_moved_to_done',
          action_type: 'post_slack',
          config: { channel: '#general' },
          enabled: true
        },
        {
          id: '2',
          org_id: 'org1',
          trigger_type: 'task_assigned',
          action_type: 'send_email',
          config: { subject: 'New task assigned' },
          enabled: false
        }
      ];
    }
  },
  createRule: async (orgSlug: string, rule: Partial<AutomationRule>) => {
    const response = await api.post(`/orgs/${orgSlug}/automations`, rule);
    return response.data as AutomationRule;
  },
  updateRule: async (orgSlug: string, ruleId: string, updates: Partial<AutomationRule>) => {
    const response = await api.patch(`/orgs/${orgSlug}/automations/${ruleId}`, updates);
    return response.data as AutomationRule;
  },
  deleteRule: async (orgSlug: string, ruleId: string) => {
    await api.delete(`/orgs/${orgSlug}/automations/${ruleId}`);
  }
};
