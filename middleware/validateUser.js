const validateUser = (req, res, next) => {
    const { name, email, password} = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }
  
    next();
  };
  
  export default validateUser;
  