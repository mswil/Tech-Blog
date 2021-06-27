const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const {withAuthApi} = require('../../utils/auth');

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
    User.findOne({
        where: {
            username: req.body.username
        },
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => {
            if (dbUserData) {
                throw { message: 'Username already taken' };
            }
            // expects {"username": "name", "password": "password1234"}
            return User.create({
                username: req.body.username,
                password: req.body.password
            });
        })
        .then(dbCreateUserData => {
            req.session.save(() => {
                req.session.user_id = dbCreateUserData.id;
                req.session.username = dbCreateUserData.username;
                req.session.loggedIn = true;

                res.json(dbCreateUserData);
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err)
        });
});

// POST /api/users/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'There is no user with that username' });
                return;
            }

            const validPassword = dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password' })
            }

            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: 'You are now logged in!' });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users/logout
router.post('/logout', withAuthApi, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
})

// future development: PUT & DELETE user.
module.exports = router;