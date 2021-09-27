const models = require("../models/index");

exports.getCardDetails = async (req, res) => {
  const getCard = await models.Card.findOne({
    where: {
      CardId: req.params.cardId
    }
  });
  if (!getCard) {
    return res.status(400).send({
      message: `Card not found`
    });
  }
  return res.send(getCard);
};

exports.addCardDetails = async (req, res) => {
  if (!validateCardNumber(req.body.cardNumber)) {
    return res.status(400).send({
      message: `Invalid Card number`
    });
  }
  if (!validateExpiration(req.body.expirationDate)) {
    return res.status(400).send({
      message: `Invalid Expiration Date`
    });
  }
  const isCardExisting = await models.Card.findOne({
    where: {
      Number: req.body.cardNumber
    }
  });
  if (!isCardExisting) {
    const newCard = await models.Card.create({
      Type: req.body.type,
      Number: req.body.cardNumber,
      SecurityCode: req.body.code,
      ExpirationDate: req.body.expirationDate,
      MonthlyLimit: validateMonthlyLimit(req.body.monthlyLimit)
        ? req.body.monthlyLimit
        : 0,
      ChildrenCardId: req.body.childrenCardId
    });

    if (!newCard) {
      return res.status(400).send({
        message: `Unable to add card`
      });
    }

    return res.send(newCard);
  } else {
    return res.status(400).send({
      message: `Card Already Exists`
    });
  }
};

exports.updateCardDetails = async (req, res) => { 
  const updateCard = await models.Card.update(
    {
      MonthlyLimit: req.body.monthlyLimit
    },
    {
      where: {
        CardId: req.body.cardId
      }
    }
  );
  if (updateCard !== 1) {
    return res.status(400).send({
      message: `Unable to update monthly limit`
    });
  } else {
    const updatedDetails = await models.Card.findOne({
      where: {
        CardId: req.body.cardId
      }
    });
    res.send(updatedDetails);
  }
};

exports.removeCard = async (req, res) => {
  const deleteCard = await models.Card.destroy({
    where: {
      CardId: req.params.cardId
    }
  });
  if (!deleteCard) {
    return res.status(400).send({
      message: `Unable to remove card`
    });
  }
  return res.send({
    message: `Successfuly removed the card`
  });
};

const validateCardNumber = (cardNumber) => {
  const re = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  return re.test(cardNumber);
};
const validateExpiration = (expiration) => {
  const mmYY = expiration.split("/");
  if (mmYY[0].length !== 2) {
    return false;
  }
  if (mmYY[1].length !== 2) {
    return false;
  }
  return true;
};
const validateMonthlyLimit = (limit) => {
  if (limit > 0) {
    return true;
  }
  return false;
};
