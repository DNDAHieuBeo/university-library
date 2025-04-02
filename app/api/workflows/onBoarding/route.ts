import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) return "non-active";

    const lastActivityDate = user[0].lastActivityDate;
    if (!lastActivityDate) return "non-active";

    const now = new Date();
    const lastActivity = new Date(lastActivityDate);
    const timeDifference = now.getTime() - lastActivity.getTime();

    if (
      timeDifference > THREE_DAYS_IN_MS &&
      timeDifference <= THIRTY_DAYS_IN_MS
    ) {
      return "non-active";
    }

    return "active";
  } catch (error) {
    console.error("Error getting user state:", error);
    throw new Error("Failed to get user state");
  }
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  try {
    // Welcome Email
    await context.run("new-signup", async () => {
      await sendEmail({
        email,
        subject: "Welcome to the platform",
        message: `Welcome ${fullName}!`,
      });
    });

    await context.sleep("wait-for-3-days", THREE_DAYS_IN_MS);

    while (true) {
      const state = await context.run("check-user-state", async () => {
        return await getUserState(email);
      });

      if (state === "non-active") {
        await context.run("send-email-non-active", async () => {
          await sendEmail({
            email,
            subject: "Are you still there?",
            message: `Hey ${fullName}, we miss you!`,
          });
        });
      } else if (state === "active") {
        await context.run("send-email-active", async () => {
          await sendEmail({
            email,
            subject: "Welcome back!",
            message: `Welcome back ${fullName}!`,
          });
        });
      }

      await context.sleep("wait-for-1-month", THIRTY_DAYS_IN_MS);
    }
  } catch (error) {
    console.error("Workflow error:", error);
    throw new Error("Workflow execution failed");
  }
});