module.exports.isAuthorized  = function(req, res, next) {
    if (req.headers['authorization'] === `Bearer ${process.env.AUTH_TOKEN}`) {
        next();
    } else {
        res.status(403);
        res.send("UnAuthorized");
    }
    
}