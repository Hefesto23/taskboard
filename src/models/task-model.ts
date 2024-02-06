import { Schema, model, models } from 'mongoose';

// Document interface
const taskSchema = new Schema({
    task: { type: String, required: true },
    user: { type: String, required: true },
    public: Boolean,
    created: Date,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })
  
// Duplicate the ID field.
taskSchema.virtual('id').get(function(){
    return this._id;
});


const Task = models?.Task || model('Task', taskSchema);

export default Task;