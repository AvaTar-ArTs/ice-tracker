import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the ActivityKeyword junction table model
interface ActivityKeywordAttributes {
  id: number;
  activityId: number;
  keywordId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityKeywordCreationAttributes extends Optional<ActivityKeywordAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ActivityKeyword extends Model<ActivityKeywordAttributes, ActivityKeywordCreationAttributes> implements ActivityKeywordAttributes {
  public id!: number;
  public activityId!: number;
  public keywordId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ActivityKeyword.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    activityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Activities',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    keywordId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Keywords',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'activity_keywords',
    sequelize,
  }
);