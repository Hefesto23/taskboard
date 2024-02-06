import db from "@/lib/dbConnection";
import Comment from "@/models/comment-model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) { 
    case 'GET': { 
       //statements; 
       try {
          db.connect()
          const taskId = req.query.taskId;
          if(!taskId) {
          const comments = await Comment.find({})
          
          return res.status(200).json(comments)
          }
          const comments = await Comment.find({taskId: taskId})
          
          return res.status(200).json(comments)
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
       const newComment =  {
            comment: data.comment,
            created: data.created,
            user: data.user,
            name: data.name,
            taskId: data.taskId,
          }
        const comment = await Comment.create(newComment)

        return res.status(201).json(comment)
      } catch (error) {
        return res.status(500);
      } 
    }
    case 'DELETE': { 
      //statements; 
      try {
         db.connect()
         const id = req.body.id
         const deletedComment = await Comment.deleteOne({_id: id})
         return res.status(202).json(deletedComment)
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
