const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    try {
        const token = req.query.token || req.cookies.token || req.headers.authorization
        if (!token) return res.status(400).json({data:{},message:"No authentication token was provided"});

        const {data:user} = jwt.verify(token, process.env.SECRET);

        req.user = user;

        next();
    }
    catch (error) {
        return res.status(400).json({data:{},message:error.message||error.error||"An error occurred. If this continues, please contact support."});
    }

}