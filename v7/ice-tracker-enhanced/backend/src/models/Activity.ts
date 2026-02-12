import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the Activity model
interface ActivityAttributes {
  id: number;
  title: string;
  description: string | null;
  link: string;
  pubDate: Date;
  sourceId: number;
  confidenceScore: number;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public link!: string;
  public pubDate!: Date;
  public sourceId!: number;
  public confidenceScore!: number;
  public content!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association fields
  public getLocations!: () => Promise<Location[]>;
  public addLocation!: (location: Location) => Promise<void>;
  public removeLocation!: (location: Location) => Promise<void>;
  public getSource!: () => Promise<Source>;
  public getKeywords!: () => Promise<Keyword[]>;
  public addKeyword!: (keyword: Keyword) => Promise<void>;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      unique: true,
    },
    pubDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sourceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Sources',
        key: 'id',
      },
    },
    confidenceScore: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'activities',
    sequelize, // passing the sequelize instance is required
  }
);