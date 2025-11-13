import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _Employee from './employee.js';
import _EmployeeType from './employeeType.js';
import _Movement from './movement.js';
import _Role from './role.js';

export default function initModels(sequelize) {
  const Employee = _Employee.init(sequelize, DataTypes);
  const EmployeeType = _EmployeeType.init(sequelize, DataTypes);
  const Movement = _Movement.init(sequelize, DataTypes);
  const Role = _Role.init(sequelize, DataTypes);

  // Movement
  Movement.belongsTo(Employee, { as: 'Employee', foreignKey: 'EmployeeID' });
  Movement.belongsTo(Role, {
    as: 'CoveringRole',
    foreignKey: 'CoveringRoleID',
  });

  // Employee
  Employee.hasMany(Movement, { as: 'Movements', foreignKey: 'EmployeeID' });
  Employee.belongsTo(EmployeeType, {
    as: 'EmployeeType',
    foreignKey: 'EmployeeTypeID',
  });
  Employee.belongsTo(Role, { as: 'Role', foreignKey: 'RoleID' });

  // EmployeeType
  EmployeeType.hasMany(Employee, {
    as: 'Employees',
    foreignKey: 'EmployeeTypeID',
  });

  // Role
  Role.hasMany(Employee, { as: 'Employees', foreignKey: 'RoleID' });
  Role.hasMany(Movement, { as: 'Movements', foreignKey: 'CoveringRoleID' });

  return {
    Employee,
    EmployeeType,
    Movement,
    Role,
  };
}
