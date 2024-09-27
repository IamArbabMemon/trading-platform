import { nanoid } from 'nanoid'

const generateOTP = async ()=> {
  const otp = nanoid(6); // Generates a 6-character OTP
  return otp;
}

export{
    generateOTP
}
