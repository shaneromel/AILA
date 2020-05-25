const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const express = require('express')
const app = express();
const bodyParser=require("body-parser");
let ipcData=require("./assets/ipc.json");
app.use(bodyParser.json());

(async() => {

    ipcData=ipcData.map(data=>{
        data.section=data.IPC.split(". ")[1];
        return data;
    })

    ipcData.forEach(data=>{

        manager.addDocument('en', data.Chapter, data.IPC);
        manager.addDocument('en', data.Description, data.IPC);
        manager.addAnswer('en', data.IPC, data.Chapter);
        manager.addAnswer('en', data.IPC, data.Description);
    })

    await manager.train();
    manager.save();

    console.log("Model successfully trained");

    app.listen(3000);
})();

app.get("/", (req, res)=>{
    res.send({status:"OK", message:"AILA rest API"})
});

app.post("/query", async (req, res)=>{
    try{
        const {query}=req.body;

        console.log(query);

        const response = await manager.process('en', query);
        res.send(response);
    }catch(err){
        res.send(err);
    }
    
})