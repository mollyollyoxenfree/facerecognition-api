const handleRegister = (req, res, db, saltRounds, bcrypt) => {
    const { email, name, password } = req.body;
    console.log(email, name, password);
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    //create a transaction when you have to do more than two things at once
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback) //rollback changes in case anything fails
        })
        .catch(err => res.status(400).json('unable to register'))
    }

    module.exports = {
        handleRegister: handleRegister
    };