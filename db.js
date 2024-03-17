const mongoose = require('mongoose');



main().catch(err =>{
    console.log(err)
    process.exit(1)
});
main().then(value =>{
    console.log("database is connected succfully.....")
    
})

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = main