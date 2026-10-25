import express from 'express';
const app = express() 

app.use(express.json()); 

// import all routes here 


// instantiate server starter endpoint 
app.get('/', () => { 
    res.status(200).json({ 
        Server: "Active"
    }); 
}); 

// mount routes here 


export default app; 