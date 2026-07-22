import sequelize from "../database/connection.js"
import { DataTypes } from "sequelize"
import { User } from "./user.model.js"
import { StudyPlan } from "./study-plan.model.js"

export const Question = sequelize.define("questions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studyPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StudyPlan,
            key: "id"
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    questionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statement: {
        type: DataTypes.STRING,
        allowNull: false
    },
    options: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    explanation: {
        type: DataTypes.STRING,
        allowNull: true
    }
})