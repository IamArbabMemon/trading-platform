import { customAlphabet }  from 'nanoid';
import { userModel } from '../models/user.model';

const generateCustomZerodhaID = async()=>{
    const letters = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3)(); // 3 letters
    const digits = customAlphabet('0123456789', 3)(); // 3 digits
    return `${letters}${digits}`;
  }
  
  const getUserZID = async()=>{
  
    let ZID= await generateCustomZerodhaID();
  
    let user = await userModel.findOne({userZID:ZID});
    
    while(user){
      ZID = await generateCustomZerodhaID();
      user = await userModel.findOne({userZID:ZID});
    }
    
    return ZID;
  
  };

  export {
    getUserZID
  }