const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const express = require('express')
const app = express();
const bodyParser=require("body-parser");
let ipcData=require("./assets/ipc.json");
app.use(bodyParser.json());

// manager.addDocument('en', 'goodbye for now', 'greetings.bye');
// manager.addDocument('en', 'bye bye take care', 'greetings.bye');
// manager.addDocument('en', 'okay see you later', 'greetings.bye');
// manager.addDocument('en', 'bye for now', 'greetings.bye');
// manager.addDocument('en', 'i must go', 'greetings.bye');
// manager.addDocument('en', 'hello', 'greetings.hello');
// manager.addDocument('en', 'hi', 'greetings.hello');
// manager.addDocument('en', 'howdy', 'greetings.hello');
 
// // Train also the NLG
// manager.addAnswer('en', 'greetings.bye', 'Till next time');
// manager.addAnswer('en', 'greetings.bye', 'see you soon!');
// manager.addAnswer('en', 'greetings.hello', 'Hey there!');
// manager.addAnswer('en', 'greetings.hello', 'Greetings!');


// console.log(ipcData.length);

// for(let i=0;i<=ipcData.length;i++){
//     const data=ipcData[i];
//     // const keys=Object.keys(data);

//     // keys.forEach(key1=>{
//     //     keys.forEach(key2=>{
//     //         if(key1 != key2){
//     //             manager.addDocument('en', data[key1], data[key2]);
//     //             manager.addAnswer('en', data[key2], data[key1]);
//     //         }
//     //     })
//     // });
//     console.log(data)
// }

(async() => {

    ipcData=ipcData.map(data=>{
        data.section=data.IPC.split(". ")[1];
        return data;
    })

    ipcData.forEach(data=>{
        // const keys=Object.keys(data);
    
        // keys.forEach(key1=>{
        //     keys.forEach(key2=>{
        //         if(key1 != key2 && ((key1 != 'IPC' && key2 != 'section') || (key2 != 'IPC' && key2 != 'section'))){
        //             manager.addDocument('en', data[key1], data[key2]);
        //             manager.addAnswer('en', data[key2], data[key1]);
        //         }
        //     })
        // });

        manager.addDocument('en', data.Chapter, data.IPC);
        manager.addDocument('en', data.Description, data.IPC);
        manager.addAnswer('en', data.IPC, data.Chapter);
        manager.addAnswer('en', data.IPC, data.Description);
    })

    await manager.train();
    manager.save();

    console.log("Model successfully trained");
    // const response = await manager.process('en', 'I should go now');
    // console.log(response);
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