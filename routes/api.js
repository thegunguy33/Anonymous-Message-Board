'use strict';

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .post((req, res) => {
    const { text, delete_password } = req.body;
    const board = req.params.board; // Use req.params.board for the board name
    
    if (!text || !delete_password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("post", req.body);
    
    const newThread = new ThreadModel({
      text: text,
      delete_password: delete_password,
      replies: [],
    });

    console.log("newThread", newThread);
    
    BoardModel.findOne({ name: board }, (err, boardData) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      if (!boardData) {
        const newBoard = new BoardModel({
          name: board,
          threads: [newThread],
        });

        console.log("newBoard", newBoard);

        newBoard.save((err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error saving in post");
          }
          
          console.log("newBoardData", data);
          res.json(newThread);
        });
      } else {
        boardData.threads.push(newThread);

        boardData.save((err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error saving in post");
          }

          res.json(newThread);
        });
      }
    });
  });
};