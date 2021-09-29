const models = require("../models/index");
const { isExpirationDateValid } = require("creditcard.js");

exports.getCardsByChildren = async (req, res) => {
  const cards = await models.Card.findAll({
    where: {
      ChildrenCardId: req.params.childid
    },
    attributes: {
      exclude: ["SecurityCode"]
    }
  });
  return res.send(cards);
};

exports.getCardDetails = async (req, res) => {
  const getCard = await models.Card.findOne({
    where: {
      CardId: req.params.cardId
    },
    attributes: {
      exclude: ["SecurityCode"]
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
      ChildrenCardId: req.body.childrenCardId,
      Balance: validateMonthlyLimit(req.body.monthlyLimit)
      ? req.body.monthlyLimit
      : 0,
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
  if (Number(req.body.monthlyLimit) <= 0) {
    return res.status(400).send({
      message: `Invalid Monthly Limit`
    })
  }
  const findCard = await models.Card.findOne({
    where: {
      CardId: req.params.cardId,
      ChildrenCardId: req.body.childrenId
    }
  });

  if (!findCard) {
    return res.status(400).send({
      message: `Card not found`
    });
  } 

  if (findCard.dataValues.Balance > Number(req.body.monthlyLimit)) {
    return res.status(400).send({
      message: `You Monthly Limit cannot be less than your available balance`
    })
  }

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
  if (updateCard[0] === 0) {
    return res.status(400).send({
      message: `Unable to update monthly limit`
    });
  }
  return res.status(200).send({
    message: `Operation Successfuly`
  });
};

exports.removeCard = async (req, res) => {
  const isExisting = await models.Card.findOne({
    where: {
      CardId: req.params.cardId,
      ChildrenCardId: req.body.childrenId
    }
  });
  if (!isExisting) {
    res.status(400).send({
      message: `Card Does not exist`
    });
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
  return isExpirationDateValid(mmYY[0], mmYY[1]);
};
const validateMonthlyLimit = (limit) => {
  if (limit > 0) {
    return true;
  }
  return false;
};

const validateSecurityCode = (code) => {
  return code.trim().length === 3;
};
