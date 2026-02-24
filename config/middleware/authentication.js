import passport from 'passport';

const customJwtAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal error', error: err });
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized1234', info });
    }

    req.user = user;
    // console.log(req.user)
    next();
  })(req, res, next);
};

export default customJwtAuth
