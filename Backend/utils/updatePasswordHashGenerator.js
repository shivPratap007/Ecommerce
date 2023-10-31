const bcrypt=require('bcryptjs');

const hashPassword=async function(password){
    const salt = bcrypt.genSaltSync(10);
    const Password = bcrypt.hashSync(password, salt);
    return Password;
}

module.exports=hashPassword