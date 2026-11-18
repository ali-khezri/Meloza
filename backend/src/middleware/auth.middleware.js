import { clerkClient } from "@clerk/express";

export async function protectRoute(req, res, next) {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }

  next();
}

export async function requireAdmin(req, res, next) {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);

    const userEmail =
      currentUser.primaryEmailAddress?.emailAddress?.toLowerCase();

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured");
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

    const isAdmin = userEmail === adminEmail;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    next(error);
  }
}
