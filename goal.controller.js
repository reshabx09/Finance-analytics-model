import Goal from "./goal.model.js";
export const list=async(req,res)=>res.json({items:await Goal.find({userId:req.user.id}).sort({deadline:1})});
export const create=async(req,res)=>{try{const {name,targetAmount,currentAmount,deadline}=req.body;if(!name||!targetAmount)return res.status(400).json({message:"Name and target amount are required"});const item=await Goal.create({userId:req.user.id,name,targetAmount,currentAmount,deadline});res.status(201).json({item});}catch(e){res.status(400).json({message:e.message})}};
export const update=async(req,res)=>{const item=await Goal.findOneAndUpdate({_id:req.params.id,userId:req.user.id},req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({message:"Goal not found"});res.json({item})};
export const remove=async(req,res)=>{const item=await Goal.findOneAndDelete({_id:req.params.id,userId:req.user.id});if(!item)return res.status(404).json({message:"Goal not found"});res.json({message:"Goal deleted"})};
