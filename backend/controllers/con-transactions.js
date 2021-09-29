const models = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
exports.checkout = async (req, res) => {
  const cardExists = await models.Card.findOne({
    where: {
      CardId: req.body.cardId,
      ChildrenCardId: req.body.childrenId
    }
  });
  const month = new Date(req.body.transactionDate).getMonth();
  const year = new Date(req.body.transactionDate).getFullYear();
  const startDate = new Date(year, month, 2);
  const endDate = new Date(year, month + 1, 2);
  const where = {
    TransactionDate: {
      [Op.between]: [startDate, endDate]
    }
  };
  if (cardExists) {
    const cardBalance = await models.Transaction.findAll({
      where: where
    });
    let total = 0;
    cardBalance.forEach((item) => {
      total = total + item.dataValues.Amount;
    });
    if (total + Number(req.body.amount) < cardExists.dataValues.MonthlyLimit) {
      const txn = await models.Transaction.create({
        CardNumber: cardExists.dataValues.Number,
        Amount: req.body.amount,
        TransactionDate: moment(new Date(req.body.transactionDate)).add(
          1,
          "days"
        )
      });

      if (!txn) {
        return res.status(400).send({
          message: `Transaction Failed`
        });
      }
      return res.status(200).send({
        message: `Transaction Successful`
      });
    } else {
      return res.status(400).send({
        message: `Monthly Limit Reached`
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
  });
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
      exclude: ["CardNumber", "updatedAt"]
    }
  });
  return res.send(txn);
};

const validateCardNumber = (cardNumber) => {
  const re = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  return re.test(cardNumber);
};
