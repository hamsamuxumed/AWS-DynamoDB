const jwt = require('jsonwebtoken');

function checkToken(req, res, next){
	const header = req.headers['authorization'];
	if(header){
		const token = header.split(' ')[1];
		const secret = process.env.TOKEN_SECRET;
		jwt.verify(token, secret, async(err, data) => {
			console.log(`data: ${data}`);
			if(err){
				res.status(403).json({err: 'Invalid token'})
			} else {
				next();
			}
		})
	} else {
		res.status(403).json({ err: 'Missing token' })
	}
}

module.exports = { checkToken }