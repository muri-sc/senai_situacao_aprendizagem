import sequelize from '../database/connection.js';
import { DataTypes } from 'sequelize';

const Evaluation = sequelize.define('Evaluation', {
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER },
  level: { type: DataTypes.STRING, allowNull: false },
  feedback: { type: DataTypes.TEXT, allowNull: false },
  rawAnswers: { type: DataTypes.JSONB, allowNull: false }
});

export default Evaluation;