import db from "@/lib/dbConnection";
import Task from "@/models/task-model";

interface ITask {
    created: Date;
    public: boolean;
    task: string;
    user: string;
  }

export const getTasks = async() => {
    try {
        db.connect()
        const tasks = await Task.find({})
        return tasks
    } catch (error) {
        throw new Error ("Failed To Get Tasks" + error)
    }
}

export const createTask = async (taskParams:ITask) => {
    try {
        db.connect()
        const task  = await Task.create(taskParams)
        return task
    } catch (error) {
        throw new Error ("Failed To Create Task " + error)
    }
}
