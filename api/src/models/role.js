import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Role extends Model {
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
        HourlyBonus: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        tableName: 'Role',
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
