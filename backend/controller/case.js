const Case = require('../models/case');
const Child = require('../models/childSchema');
const Fake = require('../models/fake');
const Process = require('../models/process');
const Notification = require('../models/notification');
const User = require('../models/user');
const Request = require('../models/request');
// IMP
exports.assignCase = async (req, res) => {


    console.log(req.body);
    const workerID=req.body.assignedWorkerID;
    const message="New Child case is assigned to you ";
    try {

        const newCase = await Case.create(req.body);
        const x = await Child.findOneAndUpdate({ _id: req.body.childID }, { $set: { status: "assigned" } })
        const notification = new Notification({workerID,message});
        const data = await notification.save();
        //assignedWorkerID
        res.status(201).send(newCase);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

};
// SOCIAL WORKER DASHBOARD
exports.assignedCase = async (req, res) => {


    console.log(req.headers);
    const assignedWorkerID = req.query.assignedWorkerID;
    console.log(assignedWorkerID);

    try {
        const x = await Case.find({ assignedWorkerID }).populate({
            path: "childID",
        }).select("-image");
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

};


// IMP FOR SOCIAL WORKER PENDINGTABLE
exports.getAssignAndNotGoing= async (req, res) => {


    const assignedWorkerID = req.query.assignedWorkerID;
    console.log(assignedWorkerID);

    try {
        const x = await Case.find({ assignedWorkerID }).populate({
            path: "childID",
            match:{
                $or:[{status:"assigned"}]
            }
        }).select("-image");
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

};

exports.getAllCaseForRoot = async (req, res) => {

    console.log(req.body);

    try {
        const x = await Case.find({ assignedWorkerID: req.body.assignedWorkerID }).populate({
            path: "childID",
            match:[]
        });
        console.log(x);
        res.status(201).send(x);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

}

//  IMP
exports.getOnGoingChildDataForAdmin = async (req, res) => {

    try {
        const abc = await Child.find({ $or: [{ status: "assigned" }, { status: "onGoing" }] }).select("-image");
        return res.status(200).json(abc);
    } catch (err) {
        return res.status(400).json(err);
    }

}

// IMP
exports.getPendingChildDataForAdmin = async (req, res) => {

    try {
        const abc = await Child.find({ $or: [{ status: "notAssigned" }] })
        return res.status(200).json(abc);
    } catch (err) {
        return res.status(400).json(err);
    }

}

exports.getAssignCaseForDashboard = async (req, res) => {


    console.log(req.body);

    try {
        const x = await Case.find({ assignedWorkerID: req.body.assignedWorkerID }).populate({
            path: "childID",
        }).select("-image");
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

};

exports.fakeApiController = async (req, res) => {

    try {
        const x = await Fake.create(req.body);
        console.log("IMAGE UPLOADED");
        return res.status(200).json(x);
    } catch (err) {
        return res.status(400).json(err);
    }

}

exports.onGoingCases = async (req, res) => {


    
    const assignedWorkerID = req.query.assignedWorkerID;
    console.log(assignedWorkerID);
    try {

        const x = await Process.find({}).populate({
            path: "caseID",
            match: { assignedWorkerID },
            populate: {
                path: "childID",
                match: { status: "onGoing" }
            }
        }
        );
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }

};

exports.completedCase = async (req, res) => {


    console.log("COMPLETED",req.body);

    try {

        const x = await Process.find({}).populate({
            path: "caseID",
            match: { assignedWorkerID: req.body.assignedWorkerID },
            match: { status: "completed" },
            populate: {
                path: "childID",
            }
        }
        );
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }
};

exports.getCompletedCaseForRoot = async (req,res) =>{
    console.log(req.body);
    try {

        const x = await Case.find({assignedWorkerID:req.body.assignedWorkerID}).populate({
            path: "childID",
            match: { status: "completed" },
        }
        );
        console.log(x);
        res.status(201).send(x);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Already Assigned to Other Volunteer" });
    }
}

// IMP
exports.changeToCompleted = async(req,res) =>{
    try{
        const result = await Child.findOneAndUpdate({_id:req.body.childID},{$set:{status:"completed"}});
        console.log(result);
        const r = await Case.findOneAndUpdate({childID:req.body.childID},{$set:{status:"completed"}});
        return res.status(200).json({message:"Completed Succesfully"});
    }catch(err){
        console.log(err);
        return result.status(400).json({message:"Some Error Occured"});
    }
}


// IMP
exports. getCaseDetail = async (req,res) =>{
     
    const childID = req.body.childID;
    try{
    const result = await Case.find({childID}).populate("assignedWorkerID",'username').populate("caseManagerID",'username');
  
    const process = await Process.find({caseID:result[0]._id},{"data":1});
    console.log(result);
   
    if(process.length == 0){
        return res.status(400).json({message:"Not Completed Chid"});
    }else{
    console.log(process);
    return res.status(200).json({worker:result[0].assignedWorkerID,process:process[0].data,caseManager:result[0].caseManagerID});
    }
    console.log(result);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }

}


// IMP
exports.requestForParentFound = async (req, res) => {
    try{
        console.log(req.body);
        var childData = await Child.find({_id:req.body.childID});
        childData = childData[0];

       console.log(childData);
        const newRequest= new Request({status:"request",childID:req.body.childID,caseNumber:childData.caseNumber,childName:childData.childName,assignedWorkerName:req.body.assignedWorkerName,note:req.body.note})
        console.log(childData.childName, req.body.note);
        const resulr=await newRequest.save();

        console.log(res);
        // const r = await Case.findOneAndUpdate({childID:req.body.childID},{$set:{status:"completed"}});
        return res.status(200).json({message:"request send  Succesfully"});
    }catch(err){
        console.log(err);
        return res.status(400).json({message:"Some Error Occured"});
    }

}


exports.fetchCompletionRequest = async (req,res) =>{
    
    try{
    const result = await Request.find({});
    return res.status(200).json(result);
    }catch(err){
        return res.status(400).json(err);
    }



}



exports.changeCompletionStatus= async (req,res) =>{


    const {response} = req.body;
    console.log(response);

    try{
    if(response == true){

        const childID = req.body.childID;
        console.log(childID);
        await Request.findOneAndDelete({childID:req.body.childID});
        await Child.findOneAndUpdate({_id:childID},{$set:{status:"completed"}});
        await Case.findOneAndUpdate({childID},{$set:{status:"completed"}});
        return res.status(200).json({message:"Success"});
    }else{
        await Request.findOneAndDelete({childID:req.body.childID});
    }
}catch(err){
    
return res.status(400).json({message:err.message});

}

}