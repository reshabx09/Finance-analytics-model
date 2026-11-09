import { model, Schema } from "mongoose";
const schema = new Schema({ userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true}, name:{type:String,required:true}, targetAmount:{type:Number,required:true,min:0}, currentAmount:{type:Number,default:0,min:0}, deadline:{type:Date} },{timestamps:true});
export default model("Goal",schema);
