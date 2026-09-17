import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(403).send({ message: "Aucun token fourni." });
    }

    const token = tokenHeader.replace(/^Bearer\s+/i, '');
    const JWT_SECRET = process.env.JWT_SECRET;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Token invalide ou expiré." });
        }
        req.userId = decoded.id;
        next();
    });
}

export default { verifyToken };