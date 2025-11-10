import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Employee from './employee.js';

const PayrollTransactions = sequelize.define(
  'PayrollTransactions',
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Deliveries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    tableName: 'PayrollTransactions',
    timestamps: false,
  }
);

Employee.hasMany(PayrollTransactions, { foreignKey: 'employeeId' });

export default PayrollTransactions;
