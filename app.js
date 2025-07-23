const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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
}

app.listen("8080",()=>{
    console.log("server is listening on port 8080");
});

app.get("/listings",async (req,res)=>{
    let properties=await Listing.find();
    res.render("index",{properties});
});

app.post("/listings",async (req,res)=>{
    let property=new Listing(req.body.listing);
    property.save();
    res.redirect("/listings")
});

app.get("/listings/new",async (req,res)=>{
    res.render("new");
});

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let property=await Listing.findById(id)
    res.render("property.ejs",{property});
});

app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let property=await Listing.findById(id);
    res.render("edit", { property });
});

app.post("/listings/:id",async (req,res)=>{
    let property=req.body.listing;
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,property, { new: true, runValidators: true });
    
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})