const db = require("../models");
const Tweet = db.tweet;
const User = db.user;
const Follower = db.follower;
const Like = db.like;
const View = db.view;
const bcrypt = require("bcryptjs");

exports.addMockData = async () => {
  await User.bulkCreate([
    {
      username: "sol",
      email: "sol@gmail.com",
      password: bcrypt.hashSync("12345", 8),
      name: "Viktor Solovyev",
      about: "a little stuped junior frontend developer",
      location: "Russia, Moscow",
      site: "www.twitter.com",
      birthday: "01.01.2000",
    },
    {
      username: "ben",
      email: "ben@gmail.com",
      password: bcrypt.hashSync("12345", 8),
      name: "Ben Affleck",
      about: "a little stuped junior frontend developer",
      location: "Russia, Moscow",
      site: "www.twitter.com",
      birthday: "01.01.2000",
    },
  ]);

  await Tweet.bulkCreate([
    {
      userId: 1,
      text: "This is my 1 tweet on this fucking server",
    },
    {
      userId: 2,
      text: "This is my 1 tweet on this fucking server",
    },
    {
      userId: 1,
      text: "This is my 2 tweet on this fucking server",
    },
    {
      userId: 1,
      text: "This is my 3 tweet on this fucking server",
    },
    {
      userId: 2,
      text: "This is my 2 tweet on this fucking server",
    },
    {
      userId: 1,
      text: "This is my 1 reply to the tweet 5 on this fucking server",
      parentId: 5,
    },
    {
      userId: 1,
      isRetweet: true,
      parentId: 2,
    },
  ]);

  await Follower.bulkCreate([
    {
      leader: 2,
      follower: 1,
    },
  ]);

  await Like.bulkCreate([
    {
      tweetId: 2,
      userId: 1,
    },
    {
      tweetId: 1,
      userId: 2,
    },
    {
      tweetId: 3,
      userId: 1,
    },
  ]);

  await View.bulkCreate([
    {
      tweetId: 2,
      userId: 1,
    },
    {
      tweetId: 5,
      userId: 1,
    },
    {
      tweetId: 4,
      userId: 2,
    },
  ]);
};
