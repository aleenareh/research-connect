--Trigger action: if a new project has the same id as an old one, overwrite the project type of the old project to be the new input
CREATE TRIGGER before_projects_insert
BEFORE INSERT
ON Projects FOR EACH ROW
BEGIN
--Holds number of records that match this Project_ID
    DECLARE num_exists INT;

--num_exists = 0 (no matching record) or 1 (exists matching record)
    SELECT COUNT(1) 
    INTO num_exists
    FROM Projects
    WHERE Project_ID = Project_ID_Input;
--if there is matching record, update both id and type to new inputs
    IF num_exists == 1 THEN
        UPDATE Projects
        SET 
Project_ID = Project_ID_Input, 
Project_Type = Project_Type_Input;

--else add this record to the table with input vals
    ELSE
        INSERT INTO Projects(Project_ID, Project_Type)
        VALUES(Project_ID_Input, Project_Type_Input);
    END IF; 

END
