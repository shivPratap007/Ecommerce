const nodemailer=require('nodemailer');

const sendEmail=async (options) =>{
    const transporter=nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        port:465,
        secure:true,
        logger:true,
        debug:true,
        secureConnection:false,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        },
        tls:{
            rejectUnauthorized:false,
        }
    })

    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.Email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;