// models/index.ts - Main models file to import all models
import { Activity } from './Activity';
import { Location } from './Location';
import { Source } from './Source';
import { Keyword } from './Keyword';
import { ActivityKeyword } from './ActivityKeyword';

// Define associations
Activity.belongsTo(Source, { foreignKey: 'sourceId' });
Source.hasMany(Activity, { foreignKey: 'sourceId' });

Activity.belongsToMany(Location, { through: 'ActivityLocations', foreignKey: 'activityId' });
Location.belongsToMany(Activity, { through: 'ActivityLocations', foreignKey: 'locationId' });

Activity.belongsToMany(Keyword, { through: ActivityKeyword, foreignKey: 'activityId' });
Keyword.belongsToMany(Activity, { through: ActivityKeyword, foreignKey: 'keywordId' });

export { Activity, Location, Source, Keyword, ActivityKeyword };