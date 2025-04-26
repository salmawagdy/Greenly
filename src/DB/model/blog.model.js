
import mongoose, {Schema,Types,model} from 'mongoose'

const blogSchema = new Schema ({
    content:{
        type:String, minLength:2, maxLength:5000,
        required:true
    },
    createdBy:{type:Types.ObjectId, ref:'user'},
    deletedBy:{type:Types.ObjectId, ref:'user'},
    idDeleted:Boolean
    },{timestamps:true})


export const blogModel = mongoose.models.blog || model('blog',blogSchema)
export default blogModel