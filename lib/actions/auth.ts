"use server";

import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";
import { headers } from "next/headers";
import { signIn } from "@/auth";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forward-for") || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.console.error };
    }
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
export const signUp = async (param: AuthCredentials) => {
  const { fullName, email, password, universityCard, universityId } = param;
  // Creating the current ip address
  const ip = (await headers()).get("x-forward-for") || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  //Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  //Create the user

  const hashedPassword = await hash(password, 10);
  try {
    {
      await db.insert(users).values({
        fullName,
        email,
        universityId,
        password: hashedPassword,
        universityCard,
      });
      await signInWithCredentials({ email, password });

      return { success: true };
    }
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
