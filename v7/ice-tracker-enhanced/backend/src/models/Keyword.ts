import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the Keyword model
interface KeywordAttributes {
  id: number;
  term: string;
  category: string; // e.g., 'enforcement', 'policy', 'legal'
  frequency: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KeywordCreationAttributes extends Optional<KeywordAttributes, 'id' | 'frequency' | 'createdAt' | 'updatedAt'> {}

export class Keyword extends Model<KeywordAttributes, KeywordCreationAttributes> implements KeywordAttributes {
  public id!: number;
  public term!: string;
  public category!: string;
  public frequency!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association fields
  public getActivities!: () => Promise<Activity[]>;
  public addActivity!: (activity: Activity) => Promise<void>;
  public removeActivity!: (activity: Activity) => Promise<void>;
}

Keyword.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    term: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'keywords',
    sequelize,
  }
);