const express = require("express");
const config = require("./databaseconfig/config");
const User = require("./databaseconfig/Users");
const Product = require("./databaseconfig/products");
const Search = require("./databaseconfig/searchprod");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
}));


const jwtkey = process.env.JWT_SECRET || "default-secret";
const port = process.env.PORT || 6600;

app.post("/regist", async (req, res) => {
  console.log(req.body)
  try {
    console.log(req.body)
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        console.error("JWT signing error:", err);
        res.status(500).send({ result: "Failed to generate token. Please try again later." });
      } else {
        res.send({ result, auth: token });
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ result: "Registration failed. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      let user = await User.findOne(req.body).select("-password");

      if (user) {
        jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            console.error("JWT signing error:", err);
            res.status(500).send({ result: "Failed to generate token. Please try again later." });
          } else {
            res.send({ user, auth: token });
          }
        });
      } else {
        res.status(404).send({ result: "Invalid credentials." });
      }
    } else {
      res.status(400).send({ result: "Please provide email and password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ result: "Login failed. Please try again." });
  }
});

function verifycation(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.warn("Middleware called with token:", token);
    jwt.verify(token, jwtkey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide a valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add a token in the header" });
  }
}

app.post("/search", async (req, res) => {
  let result = await Search.findOne(req.body);
  res.send(result);
});

app.post("/find", async (req, res) => {
  let result = await Product.findOne(req.body);
  res.send(result);
});
app.post("/add1", async (req, res) => {
  let result = await Search.findOne(req.body);
  //let result = new Product(req.body)
  let resu = await result.save();
  resu = await resu.json();
  //res.send(resu)
  // console.warn(req.body)
  // res.send(req.body)
  if (resu.brand) {
    let res1 = new Product(resu);
    // let res2  =  await res1.save()
    res.send(res1);
  } else {
    res.send({ result: "no valid data" });
  }
});
// app.post('/add', async (req,res)=>{
//     //res.send("api ran")
//    if(req.body.brand){
//       let product = await Search.find();

//       res.send(product)
//    }
//     // // product  = await product.json()
//     // if(product){
//     //     let result = new Product(product)
//     //     let resu  =  await result.save()
//     //     res.send(resu)
//     // }
//     // else{
//     //     res.send({result:"no valid data"});

//     // }

// })

app.post("/add", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/", async (req, res) => {
  let product = await Product.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no valid data" });
  }
});
app.delete("/delete", async (req, res) => {
  let result = await Product.deleteOne(req.body);
  res.send(result);
});

app.get("/update/:_id", async (req, res) => {
  let product = await Product.findOne({ _id: req.params.i });

  res.send(product);
});
app.put("/update/:_id", async (req, res) => {
  console.warn("_id:", req.params._id);
  console.warn("data:", req.body);

  try {
    const product = await Product.updateOne(
      { _id: req.params._id },
      { $set: req.body }
    );

    if (product.nModified > 0) {
      res.status(200).send({ message: "Product updated successfully" });
    } else {
      res.status(404).send({ message: "Product not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/search/:key", async (req, res) => {
  let product = await Product.find({
    $or: [
      { id: { $regex: req.params.key } },
      { name: { $regex: req.params.key } },
      { brand: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });

  res.send(product);
});







app.listen(port);
