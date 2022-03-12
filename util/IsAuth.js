import 'dotenv/config';
import jwt from 'jsonwebtoken';


export const isAuth = (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1]; // from the beare token format


    if (token){

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
            }

            req.user = decoded
            // console.log(req.user)

            next()
        })
    }  else {
        return res.status(403).send({
            "error": true,
            "message": 'No token provided.'
        });
    }

}