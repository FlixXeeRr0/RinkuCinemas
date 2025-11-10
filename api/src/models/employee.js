import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Role from './role.js';
import EmployeeType from './employeeType.js';

const Employee = sequelize.define(
  'Employee',
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    EmployeeNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    FullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
    EmployeeTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EmployeeType,
        key: 'id',
      },
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'Employee',
    timestamps: false,
  }
);

Employee.belongsTo(Role, { foreignKey: 'roleId' });
Employee.belongsTo(EmployeeType, { foreignKey: 'employeeTypeId' });

export default Employee;
