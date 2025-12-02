import { sequelize } from '../config/database.js';
import UserModel from './user.model.js';
import RefreshTokenModel from './refreshtoken.model.js';
import logger from '../config/logger.js';

const User = UserModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    logger.info('Database synchronized');
  } catch (error) {
    logger.error('Database sync failed:', error);
    throw error;
  }
};

export {
  sequelize,
  User,
  RefreshToken
};
