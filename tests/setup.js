const mongoose = require('mongoose');
mongoose.promise = global.Promise;
mongoose.set('useCreateIndex', true)

async function removeAllCollections(){
  const collections = Object.keys(mongoose.connection.collections);
  for(const collectionName of collections){
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections(){
  const collections = Object.keys(mongoose.connection.collections);
  for(const collectionName of collections){
    const collection = mongoose.connection.collections[collectionName];
    try{
      await collection.drop()
    } catch (error) {
      if (error.message === "ns not found"){
        return;
      }
      if(error.message.includes("a background operation is currently running")){
        return;
      }
      console.log(error.message);
    }
  }
}

module.exports = {
  setupDB(databaseName){
    beforeAll(async () => {
      const url = `mongodb://localhost:27017/${databaseName}`;
      await mongoose.connect(url, {useNewUrlParser: true});
    })

    afterEach(async () => {
      await removeAllCollections();
    })

    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    })
  }
}
