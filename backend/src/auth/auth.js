module.exports = (req, res, next) => {
    console.log("Session:", req.session);
    console.log("isAuth:", req.session.isAuth);

    if (req.session.isAuth) {
        next();
    } else {
        return res.status(401).json({ message: "Authentication failed" });
    }
};
