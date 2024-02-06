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
// console.log(JSON.stringify(models?.Task));

// Duplicate the ID field.
taskSchema.virtual('id').get(function(){
    return this._id;
});

// // Ensure virtual fields are serialised.
// taskSchema.set('toJSON', {
//     virtuals: true
// });

const Task = models?.Task || model('Task', taskSchema);

export default Task;