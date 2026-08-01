import { FlattenMaps } from "mongoose";
import { UserDoc } from "../utils/types";
import { ConnectionModel } from "../models";

// Helper to fetch connection info between current user and target user
export const fetchConnectionDetails = async (user: FlattenMaps<UserDoc>, requesterId: string) => {
  const targetId = user._id;

  const connection = await ConnectionModel.findOne({
    $or: [
      { requesterId, targetId },
      { requesterId: targetId, targetId: requesterId },
    ],
  })
    .select({ __v: 0 })
    .lean()
    .exec();

  if (!connection) return { ...user }

  return { ...user, connection };
};