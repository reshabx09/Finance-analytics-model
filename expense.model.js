import { model, Schema } from "mongoose";
const schema = new Schema({ userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true}, amount:{type:Number,required:true,min:0}, category:{type:String,required:true,trim:true}, description:{type:String,trim:true,default:""}, date:{type:Date,default:Date.now}, paymentMethod:{type:String,default:"UPI"} },{timestamps:true});
export default model("Expense",schema);
