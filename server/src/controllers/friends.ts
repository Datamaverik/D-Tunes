import { RequestHandler } from "express";
import FriendsModel from "../models/friends";
import UserModel from "../models/users";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import friends from "../models/friends";

//   0, //  add friend
//   1, //  requested
//   2, //  pending
//   3, //  friends
//  post req when add friend is pressed
export const sendFriendReq: RequestHandler = async (req, res, next) => {
  const UserA = req.body.userA;
  const UserB = req.body.userB;
  try {
    const docA = await FriendsModel.findOneAndUpdate(
      { requester: UserA, recipient: UserB },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    );
    const docB = await FriendsModel.findOneAndUpdate(
      { recipient: UserA, requester: UserB },
      { $set: { status: 2 } },
      { upsert: true, new: true }
    );
    const updateUserA = await UserModel.findOneAndUpdate(
      { _id: UserA },
      { $push: { friends: docA } }
    );
    const updateUserB = await UserModel.findOneAndUpdate(
      { _id: UserB },
      { $push: { friends: docB } }
    );
    res.status(200).json({
      userA: updateUserA,
      userB: updateUserB,
      message: "Friend request sent successfully",
    });
  } catch (er) {
    next(er);
  }
};

//  post req when friend req is accepted
export const acceptFriendReq: RequestHandler = async (req, res, next) => {
  const UserA = req.body.userA;
  const UserB = req.body.userB;
  try {
    await FriendsModel.findOneAndDelete({
      requester: UserA,
      recipient: UserB,
    });
    await FriendsModel.findOneAndDelete({
      requester: UserB,
      recipient: UserA,
    });
    const updatedUserA = await UserModel.findById(UserA);
    if (!updatedUserA) createHttpError(404, "User not found");
    updatedUserA?.friends.map((friend) => {
      if (friend.requester?.toString() === UserA) {
        friend.status = 3;
      }
    });
    await updatedUserA?.save();

    const updatedUserB = await UserModel.findById(UserB);
    if (!updatedUserB) createHttpError(404, "User not found");
    updatedUserB?.friends.map((friend) => {
      if (friend.requester?.toString() === UserB) {
        friend.status = 3;
      }
    });
    await updatedUserB?.save();

    res.status(200).json({
      userA: updatedUserA,
      userB: updatedUserB,
      message: "Friend request accepted",
    });
  } catch (er) {
    next(er);
  }
};

//  post req when friend req is rejected
export const rejectFriendReq: RequestHandler = async (req, res, next) => {
  const UserA = req.body.userA;
  const UserB = req.body.userB;
  try {
    const docA = await FriendsModel.findOneAndDelete({
      requester: UserA,
      recipient: UserB,
    });
    const docB = await FriendsModel.findOneAndDelete({
      requester: UserB,
      recipient: UserA,
    });
    await UserModel.findOneAndUpdate(
      { _id: UserA },
      { $pull: { friends: docA } }
    );
    await UserModel.findOneAndUpdate(
      { _id: UserA },
      { $pull: { friends: docB } }
    );
    return res.status(200).json({ message: "Friend Req rejected" });
  } catch (er) {
    next(er);
  }
};

//  get req to get all friends
export const getAllFriends: RequestHandler = async (req, res, next) => {
  const UserId = req.params.userId;
  try {
    const user = await UserModel.findById(UserId).exec();
    if (user) return res.status(200).json(user);
    else return res.status(404).json({ message: "user not found" });
  } catch (er) {
    next(er);
  }
};

export const removeFriend: RequestHandler = async (req, res, next) => {
  const UserA = req.body.userA;
  const UserB = req.body.userB;
  try {
    const docA = await FriendsModel.findOneAndDelete({
      requester: UserA,
      recipient: UserB,
    });
    const docB = await FriendsModel.findOneAndDelete({
      requester: UserB,
      recipient: UserA,
    });
    let index: number = 0;
    const updatedUserA = await UserModel.findById(UserA).exec();
    if (!updatedUserA) throw createHttpError(404, "User not found");
    if (updatedUserA.friends) {
      updatedUserA.friends.map((friend, ind) => {
        console.log(friend.requester);
        console.log(UserA);
        if (friend.requester?.toString() === UserA) {
          index = ind;
        }
      });
    }
    updatedUserA.friends.splice(index, 1);
    await updatedUserA.save();

    const updatedUserB = await UserModel.findById(UserB).exec();
    if (!updatedUserB) throw createHttpError(404, "User not found");
    if (updatedUserB.friends) {
      updatedUserB.friends.map((friend, ind) => {
        console.log(friend.requester);
        console.log(UserB);
        if (friend.requester?.toString() === UserB) {
          index = ind;
        }
      });
    }
    updatedUserB.friends.splice(index, 1);
    await updatedUserB.save();

    return res.status(200).json({
      message: "Friend Removed",
      userA: updatedUserA,
      userB: updatedUserB,
    });
  } catch (er) {
    next(er);
  }
};
