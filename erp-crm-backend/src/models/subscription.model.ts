import prisma from "../config/database";

class SubscriptionModel {
  async list() {
    return await prisma.subscriptionPlan.findMany({
      include: { subscriptionPlan: true },
    });
  }

  async listByUserId(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionPlan: true },
    });

    if (!user?.subscriptionPlan) {
      throw new Error("No subscription plan found for this user");
    }

    return user.subscriptionPlan.features;
  }

  async subscribe(userId: number, planId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new Error("Subscription plan not found");

    return await prisma.user.update({
      where: { id: userId },
      data: { subscriptionPlanId: planId },
    });
  }
}

export default new SubscriptionModel();
