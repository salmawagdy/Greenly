import mongoose from 'mongoose'

export const connectDB =async()=>{
return await mongoose.connect(process.env.DB_URI).then(res=>{
    console.log('db connected')
}).catch(err=>{
    console.error('fail to connect to db')
})
}

export default connectDB