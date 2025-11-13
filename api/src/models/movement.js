import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Movement extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        ID: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        EmployeeID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Employee',
            key: 'ID',
          },
        },
        Date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        HoursWorked: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 8.0,
        },
        DeliveriesCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        CoveringRoleID: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Role',
            key: 'ID',
          },
        },
      },
      {
        sequelize,
        tableName: 'Movement',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'ID' }],
          },
          {
            name: 'EmployeeID',
            using: 'BTREE',
            fields: [{ name: 'EmployeeID' }],
          },
          {
            name: 'CoveringRoleID',
            using: 'BTREE',
            fields: [{ name: 'CoveringRoleID' }],
          },
        ],
      }
    );
  }
}
