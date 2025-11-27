const viewController = require("./controllers/viewController");
const authController = require("./controllers/authController");

console.log("viewController.getCv:", typeof viewController.getCv);
console.log("authController.protect:", typeof authController.protect);
console.log("viewController keys:", Object.keys(viewController));
