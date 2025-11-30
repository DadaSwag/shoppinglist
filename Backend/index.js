const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/shoppinglist-db")
  .then(() => console.log("✅ Připojeno k MongoDB"))
  .catch((err) => console.error("❌ Chyba připojení k DB:", err));

const shoppingListSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
  archived: { type: Boolean, default: false },
  members: [{
    userId: String,
    name: String
  }],
  items: [{
    name: String,
    solved: { type: Boolean, default: false }
  }]
});

const ShoppingListModel = mongoose.model("ShoppingList", shoppingListSchema);
const PROFILES = { AUTHORITY: "Authorities", USER: "User", OWNER: "Owner", MEMBER: "Member" };
const CURRENT_USER = { id: "user-1", profiles: [PROFILES.USER, PROFILES.AUTHORITY] };

function checkAuthorization(requiredProfiles, listOwnerId = null, listMembers = []) {
  if (CURRENT_USER.profiles.includes(PROFILES.AUTHORITY)) return null;

  if (requiredProfiles.includes(PROFILES.OWNER) && listOwnerId === CURRENT_USER.id) return null;

  if (requiredProfiles.includes(PROFILES.MEMBER)) {
    const isMember = listMembers.some(m => m.userId === CURRENT_USER.id);
    if (isMember || listOwnerId === CURRENT_USER.id) return null;
  }

  if (requiredProfiles.includes(PROFILES.USER) && !listOwnerId) return null;

  return { code: "shoppingList/userNotAuthorized", message: "User is not authorized." };
}

function validateDtoIn(schema, dtoIn) {
  const { error } = schema.validate(dtoIn, { abortEarly: false });
  if (error) {
    return {
      code: "shoppingList/invalidDtoIn",
      message: "DtoIn is not valid.",
      validationErrors: error.details.map(d => ({ key: d.path.join("."), message: d.message }))
    };
  }
  return null;
}

app.post("/shoppingList/create", async (req, res) => {
  const dtoIn = req.body;
  const dtoOut = { dtoIn, uuAppErrorMap: {} };
  const schema = Joi.object({ name: Joi.string().max(255).required() });
  const valErr = validateDtoIn(schema, dtoIn);
  if (valErr) { dtoOut.uuAppErrorMap[valErr.code] = valErr; return res.json(dtoOut); }

  const authErr = checkAuthorization([PROFILES.USER, PROFILES.AUTHORITY]);
  if (authErr) { dtoOut.uuAppErrorMap[authErr.code] = authErr; return res.json(dtoOut); }

  try {
    const newList = new ShoppingListModel({
      name: dtoIn.name,
      ownerId: CURRENT_USER.id,
      members: [],
      items: []
    });
    const savedList = await newList.save();
    dtoOut.result = savedList;
  } catch (e) {
    dtoOut.uuAppErrorMap["shoppingList/create/dbError"] = { message: e.message };
  }

  res.json(dtoOut);
});

app.post("/shoppingList/get", async (req, res) => {
  const dtoIn = req.body;
  const dtoOut = { dtoIn, uuAppErrorMap: {} };

  const schema = Joi.object({ id: Joi.string().required() });
  const valErr = validateDtoIn(schema, dtoIn);
  if (valErr) { dtoOut.uuAppErrorMap[valErr.code] = valErr; return res.json(dtoOut); }

  try {
    const list = await ShoppingListModel.findById(dtoIn.id);
    if (!list) {
      dtoOut.uuAppErrorMap["shoppingList/get/notFound"] = { message: "List not found" };
      return res.json(dtoOut);
    }

    const authErr = checkAuthorization([PROFILES.OWNER, PROFILES.MEMBER, PROFILES.AUTHORITY], list.ownerId, list.members);
    if (authErr) { dtoOut.uuAppErrorMap[authErr.code] = authErr; return res.json(dtoOut); }

    dtoOut.result = list;
  } catch (e) {
    dtoOut.uuAppErrorMap["shoppingList/get/dbError"] = { message: e.message };
  }
  res.json(dtoOut);
});

app.post("/shoppingList/list", async (req, res) => {
  const dtoIn = req.body;
  const dtoOut = { dtoIn, uuAppErrorMap: {} };
  const schema = Joi.object({ showArchived: Joi.boolean() });
  const valErr = validateDtoIn(schema, dtoIn);
  if (valErr) { dtoOut.uuAppErrorMap[valErr.code] = valErr; return res.json(dtoOut); }

  try {
    let filter = {
      $or: [{ ownerId: CURRENT_USER.id }, { "members.userId": CURRENT_USER.id }]
    };
    if (!dtoIn.showArchived) {
      filter.archived = false;
    }

    const lists = await ShoppingListModel.find(filter);
    dtoOut.result = lists;
  } catch (e) {
    dtoOut.uuAppErrorMap["shoppingList/list/dbError"] = { message: e.message };
  }
  res.json(dtoOut);
});

app.post("/shoppingList/update", async (req, res) => {
  const dtoIn = req.body;
  const dtoOut = { dtoIn, uuAppErrorMap: {} };

  const schema = Joi.object({ id: Joi.string().required(), name: Joi.string().required() });
  const valErr = validateDtoIn(schema, dtoIn);
  if (valErr) { dtoOut.uuAppErrorMap[valErr.code] = valErr; return res.json(dtoOut); }

  try {
    const list = await ShoppingListModel.findById(dtoIn.id);
    if (!list) { dtoOut.uuAppErrorMap["shoppingList/update/notFound"] = { message: "List not found" }; return res.json(dtoOut); }

    const authErr = checkAuthorization([PROFILES.OWNER], list.ownerId);
    if (authErr) { dtoOut.uuAppErrorMap[authErr.code] = authErr; return res.json(dtoOut); }

    list.name = dtoIn.name;
    await list.save();
    dtoOut.result = list;
  } catch (e) { dtoOut.uuAppErrorMap["shoppingList/update/dbError"] = { message: e.message }; }
  res.json(dtoOut);
});

app.post("/shoppingList/delete", async (req, res) => {
  const dtoIn = req.body;
  const dtoOut = { dtoIn, uuAppErrorMap: {} };

  const schema = Joi.object({ id: Joi.string().required() });
  const valErr = validateDtoIn(schema, dtoIn);
  if (valErr) { dtoOut.uuAppErrorMap[valErr.code] = valErr; return res.json(dtoOut); }

  try {
    const list = await ShoppingListModel.findById(dtoIn.id);
    if (!list) { dtoOut.uuAppErrorMap["shoppingList/delete/notFound"] = { message: "List not found" }; return res.json(dtoOut); }

    const authErr = checkAuthorization([PROFILES.OWNER], list.ownerId);
    if (authErr) { dtoOut.uuAppErrorMap[authErr.code] = authErr; return res.json(dtoOut); }

    await ShoppingListModel.findByIdAndDelete(dtoIn.id);
    dtoOut.result = { success: true };
  } catch (e) { dtoOut.uuAppErrorMap["shoppingList/delete/dbError"] = { message: e.message }; }
  res.json(dtoOut);
});

app.listen(3000, () => {
  console.log("Server běží na http://localhost:3000");
});