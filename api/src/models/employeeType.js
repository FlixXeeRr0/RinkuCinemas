import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EmployeeType = sequelize.define(
  'EmployeeType',
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'EmployeeType',
    timestamps: false,
  }
);

export default EmployeeType;
