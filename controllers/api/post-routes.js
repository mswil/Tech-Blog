const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET /api/posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'There is NO post with that ID' });
                return
            }
            res.json(dbPostData)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// POST /api/posts
router.post('/', (req, res) => {
    // expects {"title": "post title", "content": "post content", "user_id": #}
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
    // expects {"title": "post title", "content": "post content", "user_id": #}
    Post.update(
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'There is NO post with that ID' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'There is NO post with that ID' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
})

module.exports = router;
