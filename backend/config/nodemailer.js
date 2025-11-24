import nodemailer from'nodemailer' 
import {EMAIL_USER,EMAIL_PASSWORD} from '../config/env.js'


const transPorter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:EMAIL_USER,
        pass:EMAIL_PASSWORD
    }
})


transPorter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export default transPorter;