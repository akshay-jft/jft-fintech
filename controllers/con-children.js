const models = require("../models/index");

exports.getChildrenDetails = async (req, res) => {
  const child = await models.Children.findOne({
    where: {
      ChildrenId: req.params.id
    },
    attributes: {
      exclude: ["ChildrenId"]
    }
  });
  if (!child) {
    return res.status(400).send({
      message: `Child not found`
    });
  }
  return res.send(child);
};

exports.addChild = async (req, res) => {
  if (req.body.name.trim().length === 0) {
    return res.status(400).send({
      message: `Invalid Name, cannot be empty`
    })
  }
  if (Number(req.body.age.trim()) <= 0) {
    return res.status(400).send({
      message: `Invalid Age`
    })
  }

  const existingChild = await models.Children.findOne({
    where: {
      Name: req.body.name
    }
  }); 
  if (!existingChild) {
    const child = await models.Children.create({
      Name: req.body.name,
      Age: req.body.age,
      ParentId : req.body.parentid
    });
    if (!child) {
      return res.status(400).send({
        message: `Invalid Details, Please try again with valid details`
      });
    }
    return res.send(child);
  } else {
    res.status(400).send({
      message: `Child with given details already exist`
    });
  }
};

exports.updateChildrenDetails = async (req, res) => {
  const existingChild = await models.Children.findOne({
    where: {
      ChildrenId: req.params.id
    }
  });
  if (existingChild) {
    let updatedValues = {
      Name: validateName(req.body.name, existingChild.dataValues.Name),
      Age: validateAge(req.body.age, existingChild.dataValues.Age)
    };
    const updatedChild = await models.Children.update(
      {
        Name: updatedValues.Name,
        Age: updatedValues.Age
      },
      {
        where: {
          ChildrenId: req.params.id
        }
      }
    );
    if (updatedChild) {
      const child = await models.Children.findOne({
        where: {
          ChildrenId: req.params.id
        }
      })
      return res.send(child)
    } 
  } else {
    res.status(400).send({
      message: `The Children does not exist`
    });
  }
};

exports.deleteChild = async (req, res) => {
  const isExist = await models.Children.findOne({
    where: {
      ChildrenId: req.params.id
    }
  });
  if (isExist) {
    const deletedChild = await models.Children.destroy({
      where: {
        ChildrenId: req.params.id
      }
    });
    if (!deletedChild) {
      return res.status(400).send({
        message: `Unable to remove the child, try again later`
      });
    }
    return res.status(200).send({
      message: `Children Removed`
    });
  } else {
    res.status(400).send({
      message: `Children does not exist`
    });
  }
};

const validateName = (newName, existingName) => {
  if (newName && newName.trim().length > 5) {
    return newName;
  } else {
    return existingName;
  }
};

const validateAge = (newAge, existingAge) => {
  if (Number(newAge) && Number(newAge) > 0) {
    return newAge;
  } else {
    return existingAge;
  }
};
