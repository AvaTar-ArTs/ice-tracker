import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the Source model
interface SourceAttributes {
  id: number;
  name: string;
  url: string;
  sourceType: 'rss' | 'api' | 'website' | 'social_media';
  isActive: boolean;
  lastFetched: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SourceCreationAttributes extends Optional<SourceAttributes, 'id' | 'createdAt' | 'updatedAt' | 'lastFetched'> {}

export class Source extends Model<SourceAttributes, SourceCreationAttributes> implements SourceAttributes {
  public id!: number;
  public name!: string;
  public url!: string;
  public sourceType!: 'rss' | 'api' | 'website' | 'social_media';
  public isActive!: boolean;
  public lastFetched!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association fields
  public getActivities!: () => Promise<Activity[]>;
  public addActivity!: (activity: Activity) => Promise<void>;
}

Source.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    sourceType: {
      type: DataTypes.ENUM('rss', 'api', 'website', 'social_media'),
      defaultValue: 'rss',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastFetched: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'sources',
    sequelize,
  }
);