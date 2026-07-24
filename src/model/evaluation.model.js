import sequelize from '../database/connection.js';
import { DataTypes } from 'sequelize';
import { StudyPlan } from './study-plan.model.js';

const Evaluation = sequelize.define('Evaluation', {
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  studyPlanId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: StudyPlan,
      key: 'id',
    },
  },
  score: { type: DataTypes.INTEGER },
  level: { type: DataTypes.STRING, allowNull: false },
  feedback: { type: DataTypes.TEXT, allowNull: false },
  rawAnswers: { type: DataTypes.JSONB, allowNull: false }
});

export default Evaluation;