const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({ attributes: { exclude: ['password'] } })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'There is NO user with that ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err)
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {"username": "name", "password": "password1234"}
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    // TODO: Session
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.error(err);
        res.status(500).json(err)
    });
});

module.exports = router;