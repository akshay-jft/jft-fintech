const models = require("../models/index");

exports.checkout = async (req, res) => {
  const cardExists = await models.Card.findOne({
    where: {
      CardId: req.body.cardId,
      ChildrenCardId: req.body.childrenId
    }
  });
  if (cardExists) {
    if (
      Number(cardExists.dataValues.Balance) - Number(req.body.amount) >
      0
    ) {
      const txn = await models.Transaction.create({
        CardNumber: cardExists.dataValues.Number,
        Amount: req.body.amount
      });
      
      if (txn) { 
        const finalAmount =
          Number(cardExists.dataValues.Balance) -
          Number(req.body.amount);
        const txnSuccess = await models.Card.update(
          {
            Balance: finalAmount
          },
          {
            where: {
              Number: cardExists.dataValues.Number
            }
          }
        );

        if (txnSuccess) {
          const updatedBalance = await models.Card.findOne({
            where: {
              CardId: req.body.cardId,
            },
            attributes: {
              exclude: ['SecurityCode']
            }
          });
          return res.send(updatedBalance);
        }
      }
    } else {
      res.status(400).send({
        message: "Amount to be charged Exceed Available Balance"
      });
    }
  } else {
    return res.status(400).send({
      message: `Unregistered Card`
    });
  }
};

exports.getTransactions = async (req, res) => { 
  const cardExist = await models.Card.findOne({
    where: {
      CardId: req.params.cardId
    }
  }) 
  if (!cardExist) {
    return res.status(400).send({
      message: `Card Not registered`
    });
  }
  const txn = await models.Transaction.findAll({
    where: {
      CardNumber: cardExist.dataValues.Number
    },
    attributes: {
      exclude: ['CardNumber', 'updatedAt']
    }
  }); 
  return res.send(txn)
};

const validateCardNumber = (cardNumber) => {
  const re = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  return re.test(cardNumber);
};
