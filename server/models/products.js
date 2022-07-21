'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.belongsTo(models.user, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })

      products.hasMany(models.transaction, {
        as: 'transactions',
        foreignKey: {
          name: 'idProduct'
        }
      })

      products.belongsToMany(models.categories, {
        as: 'category',
        through: {
          model: 'productCategory',
          as: 'bridge'
        },
        foreignKey: 'idProduct'
      })
    }
  }
  products.init({
    name: DataTypes.STRING,
    desc: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};