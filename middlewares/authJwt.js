import jwt from 'jsonwebtoken';

function verifyToken(req, res, next){
    const tokenHeader = req.headers['authorization'];

    if(!tokenHeader){
        return res.status(403).send({message: "Aucun token fourni."});
    }

    let token = tokenHeader;
    if(tokenHeader.startsWith('Bearer ')){
        token = tokenHeader.substring(7);
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    jwt.verify(token, JWT_SECRET, function(err, decoded){
        if(err){
            return res.status(401).send({message: "Token invalide ou expiré."});
        }
        req.userId = decoded.id;
        next();
    });
}

export default { verifyToken };