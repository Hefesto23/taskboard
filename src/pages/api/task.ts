import db from "@/lib/dbConnection";
import Task from "@/models/task-model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) { 
    case 'GET': { 
       //statements; 
       try {
          db.connect()
          const id = req.query.id;
          if(!id) {
          const tasks = await Task.find({})
          
          return res.status(200).json(tasks)
          }
          const task = await Task.findOne({_id: id})
          
          return res.status(200).json(task)
          break; 
        } catch (error) {
          return res.status(500);
          break; 
        }
    } 
    case 'POST': { 
       //statements;
       try {
       db.connect()
       const data = req.body;
       const newTask =  {
            task: data.task,
            created: data.created,
            taskId: data.taskId,
            user: data.user,
            public: data.public,
          }
        const task = await Task.create(newTask)

        return res.status(201).json(task)
      } catch (error) {
        return res.status(500);
      } 
    }
    case 'DELETE': { 
      //statements; 
      try {
         db.connect()
         const id = req.body.id
         const deletedTask = await Task.deleteOne({_id: id})
         return res.status(202).json(deletedTask)
       } catch (error) {
         return res.status(500);
       }
    }  
    default: { 
       //statements;
       return res.status(404).send('Page not found') 
       break; 
    } 
 } 
  
}
