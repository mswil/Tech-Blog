const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
};

const withAuthApi = (req, res, next) => {
    if (!req.session.user_id) {
        res.status(401).json({ message: 'Session expired' });
    } else {
        next();
    }
}
module.exports = { withAuth, withAuthApi };
