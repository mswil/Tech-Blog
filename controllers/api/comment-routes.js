const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET /api/comments
router.get('/', (req, res) => {
    Comment.findAll({
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Post,
                attributes: ['title', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// GET /api/comments/:id
router.get('/:id', (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['title', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'There is NO comment with that ID' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// POST /api/comments
router.post('/', (req, res) => {
    // expects {"comment_text": "text", "user_id": #, "post_id": #}
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// PUT /api/comments/:id
router.put('/:id', (req, res) => {
    // expects {"comment_text": "text", "user_id": #, "post_id": #}
    Comment.update(
        {
            comment_text: req.body.comment_text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'There is NO comment with that ID' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// DELETE /api/comments/:id
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'There is NO comment with that ID' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
})

module.exports = router;
