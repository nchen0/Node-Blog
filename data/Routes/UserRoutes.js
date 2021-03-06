const express = require("express");
const users = require("../helpers/userDb.js");

const router = express.Router();

router.get("/", (req, res) => {
  users
    .get()
    .then(users => res.status(200).json(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    );
});

router.get("/:id", (req, res) => {
  users
    .get(req.params.id)
    .then(user => {
      if (user.length !== 0) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name for the user" });
  }
  users
    .insert({ name })
    .then(user => res.status(201).json(user))
    .catch(err =>
      res
        .status(500)
        .json({ error: "There was an error saving the user to the database." })
    );
});

router.delete("/:id", (req, res) => {
  users
    .get(req.params.id)
    .then(response => {
      if (response.length === 0) {
        return res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json(response);
      users
        .remove(req.params.id)
        .then(count => {
          if (count === 0) {
            return res.status(404).json({
              message: "The user with the specified ID does not exist."
            });
          }
        })
        .catch(err => {
          res.status(500).json({ error: "The post could not be removed." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  users
    .get(req.params.id)
    .then(posts => {
      if (posts.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        users
          .update(req.params.id, { name })
          .then(count => {
            console.log(count);
            users
              .get(req.params.id)
              .then(post => {
                res.status(200).json(post);
              })
              .catch(err => {
                res.status(500).json({
                  error: "The post information could not be retrieved."
                });
              });
          })

          .catch(err => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

router.get("/:id/posts", (req, res) => {
  users
    .getUserPosts(req.params.id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(() => {
      res.status(404).json({ error: "The specified User ID does not exist." });
    });
});

module.exports = router;
