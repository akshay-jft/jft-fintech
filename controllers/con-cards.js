const models = require("../models/index");
const { isExpirationDateValid } = require('creditcard.js')
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
  if (!validateSecurityCode(req.body.code)) {
    return res.status(400).send({
      message: `Invalid Security Code`
    })
  }
  const isCardExisting = await models.Card.findOne({
    where: {
      Number: req.body.cardNumber
    }
  });
  if (!isCardExisting) {
    const newCard = await models.Card.create({
      Type: req.body.type.trim(),
      Number: req.body.cardNumber.trim(),
      SecurityCode: req.body.code.trim(),
      ExpirationDate: req.body.expirationDate.trim(),
      MonthlyLimit: validateMonthlyLimit(req.body.monthlyLimit)
        ? req.body.monthlyLimit
        : 0,
      ChildrenCardId: req.body.childrenCardId.trim()
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
        CardId: req.params.cardId
      }
    }
  );
  if (updateCard[0]===0) {
    return res.status(400).send({
      message: `Unable to update monthly limit or it may have already been the same limit`
    });
  } else {
    const updatedDetails = await models.Card.findOne({
      where: {
        CardId: req.params.cardId
      }
    });
    res.send(updatedDetails);
  }
};

exports.removeCard = async (req, res) => {
  const isExisting = await models.Card.findOne({
    where: {
      CardId: req.params.cardId
    }
  })
  if (!isExisting) {
    res.status(400).send({
      message: `Card Does not exist`
    })
  }
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
  return isExpirationDateValid(mmYY[0], mmYY[1])
};
const validateMonthlyLimit = (limit) => {
  if (limit > 0) {
    return true;
  }
  return false;
};

const validateSecurityCode = code => {
  return code.trim().length === 3
}
