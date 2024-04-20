
const router = require("express").Router()
const { Error, Success } = require("../Utils/responseWrap")
const middleware = require("../middleware/middleware")
const userSchema = require("../models/Auth")
const noteSchema = require("../models/Note")

router.get("/",(req,res)=>{
    res.send({name:"safiullah ansari"})
})

router.get("/allnotes",middleware,async(req,res)=>{
    try {
        const allNotes = await noteSchema.find()
         return res.json(Success(allNotes,200))
    } catch (error) {
        return res.json(Error(error.message,400))
    }
})


router.post("/addnote",middleware,async(req,res)=>{
       try {
        const {title,description,tag} = req.body
        if(!title || !description || !tag){
            return res.json(Error("please Enter all field", 400))
        }
        const user = await userSchema.findById(req.user._id)
        const saveNotes =  await noteSchema.create({
            user:user._id,
            title,description,tag
        })
         user.notes.push(saveNotes._id)
         await user.save()
         return res.json(Success(saveNotes,201))
       } catch (error) {
        return res.json(Error(error.message,400))
       }
})

router.put("/",middleware,async(req,res)=>{
    try {
        const {title,description,tag,noteId} = req.body
        const note = await noteSchema.findById(noteId)
        if(req.user._id !== note.user.toString()){
           return res.json(Error("you can not update this note",400))
        }

         if(title) { note.title = title}
         if(description) { note.description = description}
         if(tag) { note.tag = tag}

         await note.save()

        return res.json(Success("note updated",200))

      } catch (error) {
       return res.json(Error(error.message,400))
      }
})

router.delete("/",middleware,async(req,res)=>{
       try {
        // console.log(req.params)
        const {noteId} = req.body
        // console.log(noteId)
        const note = await noteSchema.findById(noteId)
         if(req.user._id !== note.user.toString()){
            return res.json(Error("you can not delete this note",400))
         }

         const deletedNote = await noteSchema.findByIdAndDelete(noteId)
         const user = await userSchema.findById(req.user._id)
         user.notes = user.notes.filter(id=>id.toString() !== noteId)
         await user.save()

         return res.json(Success("note deleted",200))

       } catch (error) {
        return res.json(Error(error.message,400))
       }
})


router.get("/usernotes",middleware,async(req,res)=>{
        try {
            const user = await userSchema.findById(req.user._id).populate("notes")
             return res.json(Success(user.notes,200))
        } catch (error) {
            return res.json(Error("note not found",400))
        }
})




module.exports = router