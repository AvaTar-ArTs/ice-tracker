import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the Location model
interface LocationAttributes {
  id: number;
  name: string;
  type: 'city' | 'county' | 'state' | 'country'; // Location type
  latitude: number | null;
  longitude: number | null;
  stateCode: string | null; // For cities/counties, state abbreviation
  countryCode: string; // Country code (e.g., US)
  population: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationCreationAttributes extends Optional<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: number;
  public name!: string;
  public type!: 'city' | 'county' | 'state' | 'country';
  public latitude!: number | null;
  public longitude!: number | null;
  public stateCode!: string | null;
  public countryCode!: string;
  public population!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association fields
  public getActivities!: () => Promise<Activity[]>;
  public addActivity!: (activity: Activity) => Promise<void>;
  public removeActivity!: (activity: Activity) => Promise<void>;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('city', 'county', 'state', 'country'),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    stateCode: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(2),
      defaultValue: 'US',
    },
    population: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: 'locations',
    sequelize,
  }
);