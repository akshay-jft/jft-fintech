const models = require("../models/index");

exports.checkout = async (req, res) => {
  const card = validateCardNumber(req.body.cardNumber);

  if (!card) {
    return res.status(400).send({
      message: `Invalid Card number`
    });
  } else {
    const cardExists = await models.Card.findOne({
      where: {
        Number: req.body.cardNumber
      }
    });
    if (cardExists) {
      if (
        Number(cardExists.dataValues.MonthlyLimit) - Number(req.body.amount) >
        0
      ) {
        const txn = await models.Transaction.create({
          CardNumber: req.body.cardNumber,
          Amount: req.body.amount
        });
        if (txn) {
          const finalAmount =
            Number(cardExists.dataValues.MonthlyLimit) -
            Number(req.body.amount);
          const txnSuccess = await models.Card.update(
            {
              MonthlyLimit: finalAmount
            },
            {
              where: {
                Number: req.body.cardNumber
              }
            }
          );

          if (txnSuccess) {
            const updatedBalance = await models.Card.findOne({
              where: {
                Number: req.body.cardNumber
              }
            });
            return res.send(updatedBalance);
          }
        }
      } else {
        res.status(400).send({
          message: "Amount to be charged Exceed Monthly Limit"
        });
      }
    } else {
      return res.status(400).send({
        message: `Unregistered Card`
      });
    }
  }
};

const validateCardNumber = (cardNumber) => {
  const re = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  return re.test(cardNumber);
};
