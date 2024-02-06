import { Schema, model, models } from 'mongoose';

// Document interface
const commentSchema = new Schema({
    comment: String,
    user: String,
    name: String,
    taskId: String,
    created: Date,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })
  
// Duplicate the ID field.
commentSchema.virtual('id').get(function(){
    return this._id;
});


const Comment = models?.Comment || model('Comment', commentSchema);

export default Comment;