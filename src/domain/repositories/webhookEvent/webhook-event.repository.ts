export interface WebhookEventPayload {
  id: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface WebhookEventRepository {
  exists(id: string): Promise<boolean>;
  create(payload: WebhookEventPayload): Promise<void>;
}
