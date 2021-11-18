const bodyParser = require("body-parser");
const express = require("express"); 
const app = express(); 
const mysql = require("mysql"); 
const cors = require("cors"); 

var db_config = mysql.createConnection({
    host:'35.202.11.152', 
    user: 'root', 
    password:'12345', 
    database:'research_connect',
})

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.json()); 

// 1. submit a new project. 
app.post("/api/insert", (require,response) => {
    console.log("inserting.."); 
    // INSERT INTO Project(Project_ID, Project_Type) VALUES (Project_ID_Input, Project_ID_Type);
    const projectId = require.body.projectId; 
    const projectType = require.body.projectType; 
    console.log(projectType); 
    console.log("inserting.."); 
    const sqlInsert = "INSERT INTO `Project` (`Project_ID`, `Project_Type`)  VALUES (?, ?)";
    db_config.query(sqlInsert, [projectId, projectType], (err, result) => {
        if (err) console.log(err); 
    })
})

// 2. search our database using keyword. 
app.get("/api/:interests", (require, response) => {
    // SELECT First_Name, Last_Name, Email FROM Researcher WHERE Interests = Interest_Input
    const interests = require.params['interests']; 
    console.log(interests); 
    console.log("getting..");
    const sqlSelect = "SELECT `First_Name`, `Researcher_ID`, `Last_Name`, `Email`, `Department` FROM `Researcher` WHERE `Interests` = ?;";
    db_config.query(sqlSelect, [interests], (err, result) => {
        console.log(result);
        response.send(result); 
    }) 
}) 

// 3. Update records on the database. 
app.put("/api/update", (require, response) => {
    // UPDATE Researcher SET Interests = Interest_Input WHERE Researcher_ID = Researcher_ID_Input;
    console.log("updating..");
    const interests = require.body.interests; 
    const researcherId = require.body.researcherId; 
    console.log("updating.."); 
    const sqlUpdate = "UPDATE `Researcher` SET `Interests` = ? WHERE `Researcher_ID` = ?;"
    db_config.query(sqlUpdate, [interests, researcherId], (err, result) => {
        console.log(err); 
    })
})

// 4. delete an existing project.
app.delete("/api/delete/:projectType", (require,response) => {
    // DELETE FROM Project WHERE Project_ID = Project_ID_Input;
    const projectType = require.params.projectType; 
    console.log(projectType); 
    console.log("deleting.."); 
    const sqlInsert = "DELETE FROM Project WHERE Project_Type = ?;";
    db_config.query(sqlInsert, [projectType], (err, result) => {
        if (err) console.log(err); 
        // response.send("inserting!");
    }) 
})

// 5. advanced sql queries. 
app.get("/api/get/senior-grad", (require, response) => {
    console.log("getting.."); 
    const sqlSelect = "(SELECT COUNT(*) AS freq, Student_Year AS student_year FROM Student WHERE student_year = 4 GROUP BY student_year ORDER BY freq DESC) UNION (SELECT COUNT(*) AS freq, Grad_Year AS grad_year  FROM Grad WHERE grad_year >= 2 GROUP BY grad_year ORDER BY freq DESC) ORDER BY freq DESC;";
    
    db_config.query(sqlSelect, (err, result) => {
        console.log(result); 
        response.send(result); 
        if (err) console.log(err); 
    })
}) 
app.get("/api/get/ai-research", (require, response) => {
    console.log("getting.."); 
    const sqlSelect = "SELECT Last_Name, First_Name FROM Researcher WHERE Project_ID IN (SELECT Project_ID FROM Project p NATURAL JOIN Researcher r WHERE r.Interests ='artificial_intelligence');";
    db_config.query(sqlSelect, (err, result) => {
        console.log(result); 
        response.send(result); 
        if (err) console.log(error); 
    })
})

// initial text for backend page
app.get('/', (require, response) => {
    response.send("here's the backend!"); 
})

app.listen(3002, () => {
    console.log("running on port 3002"); 
})