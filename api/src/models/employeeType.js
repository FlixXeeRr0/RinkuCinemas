import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EmployeeType extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        ID: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'EmployeeType',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'ID' }],
          },
        ],
      }
    );
  }
}
