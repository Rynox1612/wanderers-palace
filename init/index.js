const mongoose=require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");

let MONGOOSE_URL= "mongodb://127.0.0.1:27017/WanderPalace";
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    mongoose.connect(MONGOOSE_URL);
};

async function insertData(data){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

insertData();