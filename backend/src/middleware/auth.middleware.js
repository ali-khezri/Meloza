import { clerkClient } from "@clerk/express";

export async function protectRoute(req, res, next) {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);

    const isAdmin =
      process.env.Admin_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}
