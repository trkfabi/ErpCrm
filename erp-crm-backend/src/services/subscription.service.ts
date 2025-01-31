import SubscriptionModel from "../models/subscription.model";

class SubscriptionService {
  async list() {
    return await SubscriptionModel.list();
  }

  async subscribe(userId: number, planId: number) {
    return await SubscriptionModel.subscribe(userId, planId);
  }
}

export default new SubscriptionService();
