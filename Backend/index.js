const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const PROFILES = {
  AUTHORITY: "Authorities",
  USER: "User",
  OWNER: "Owner",
  MEMBER: "Member",
};

const SIMULATED_USER_PROFILES = [PROFILES.OWNER];

function checkAuthorization(requiredProfiles) {
  const isAuthorized = SIMULATED_USER_PROFILES.some(userProfile =>
    requiredProfiles.includes(userProfile)
  );
  if (!isAuthorized) {
    return {
      code: "shoppinglist-main/userNotAuthorized",
      message: "User is not authorized.",
    };
  }
  return null;
}

function validateDtoIn(schema, dtoIn) {
  const { error } = schema.validate(dtoIn, { abortEarly: false });
  if (error) {
    return {
      code: "shoppinglist-main/invalidDtoIn",
      message: "DtoIn is not valid.",
      validationErrors: error.details.map(detail => ({
        key: detail.path.join("."),
        message: detail.message,
      })),
    };
  }
  return null;
}

app.post("/shoppingList/create", (req, res) => {
  const dtoIn = req.body;
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
  });
  const requiredProfiles = [PROFILES.USER, PROFILES.AUTHORITY, PROFILES.OWNER];
  const dtoOut = { dtoIn: dtoIn, uuAppErrorMap: {} };

  const validationError = validateDtoIn(schema, dtoIn);
  if (validationError) dtoOut.uuAppErrorMap[validationError.code] = validationError;

  const authorizationError = checkAuthorization(requiredProfiles);
  if (authorizationError) dtoOut.uuAppErrorMap[authorizationError.code] = authorizationError;

  res.json(dtoOut);
});

app.post("/shoppingList/get", (req, res) => {
  const dtoIn = req.body;
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const requiredProfiles = [PROFILES.OWNER, PROFILES.MEMBER, PROFILES.AUTHORITY];
  const dtoOut = { dtoIn: dtoIn, uuAppErrorMap: {} };

  const validationError = validateDtoIn(schema, dtoIn);
  if (validationError) dtoOut.uuAppErrorMap[validationError.code] = validationError;

  const authorizationError = checkAuthorization(requiredProfiles);
  if (authorizationError) dtoOut.uuAppErrorMap[authorizationError.code] = authorizationError;

  res.json(dtoOut);
});

app.post("/shoppingList/list", (req, res) => {
  const dtoIn = req.body;
  const schema = Joi.object({
    showArchived: Joi.boolean().default(false)
  });
  const requiredProfiles = [PROFILES.USER, PROFILES.AUTHORITY, PROFILES.OWNER];
  const dtoOut = { dtoIn: dtoIn, uuAppErrorMap: {} };

  const validationError = validateDtoIn(schema, dtoIn);
  if (validationError) dtoOut.uuAppErrorMap[validationError.code] = validationError;

  const authorizationError = checkAuthorization(requiredProfiles);
  if (authorizationError) dtoOut.uuAppErrorMap[authorizationError.code] = authorizationError;

  res.json(dtoOut);
});

app.post("/shoppingList/delete", (req, res) => {
  const dtoIn = req.body;
  const schema = Joi.object({
    id: Joi.string().required()
  });
  const requiredProfiles = [PROFILES.OWNER, PROFILES.AUTHORITY];
  const dtoOut = { dtoIn: dtoIn, uuAppErrorMap: {} };

  const validationError = validateDtoIn(schema, dtoIn);
  if (validationError) dtoOut.uuAppErrorMap[validationError.code] = validationError;

  const authorizationError = checkAuthorization(requiredProfiles);
  if (authorizationError) dtoOut.uuAppErrorMap[authorizationError.code] = authorizationError;

  res.json(dtoOut);
});

app.post("/shoppingList/update", (req, res) => {
  const dtoIn = req.body;
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().max(255).required()
  });
  const requiredProfiles = [PROFILES.OWNER, PROFILES.AUTHORITY];
  const dtoOut = { dtoIn: dtoIn, uuAppErrorMap: {} };

  const validationError = validateDtoIn(schema, dtoIn);
  if (validationError) dtoOut.uuAppErrorMap[validationError.code] = validationError;

  const authorizationError = checkAuthorization(requiredProfiles);
  if (authorizationError) dtoOut.uuAppErrorMap[authorizationError.code] = authorizationError;

  res.json(dtoOut);
});

if (require.main === module) {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
  });
}

module.exports = app;