const jwt = require('jsonwebtoken');


const authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
  
      if (!token) {
        return res.sendStatus(401)
      }
  
      jwt.verify(token, process.env.JWT_KEY, (err, user) => {

        if (err) {
            
          return res.sendStatus(403)
        }
        console.log(user);

        req.user = {
          fullName:user.fullName,
          id: user.id,
          email:user.email,

        }

        next()
      })
    } catch (error) {
      console.error("Error in authenticateToken:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  
  module.exports =  authenticateToken ;
