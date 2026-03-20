import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare role: string;
  declare teamSize: string;
  declare email: string;
  declare password: string;
  declare verified: boolean;
  declare verificationToken: string | null;
  declare verificationExpiresAt?: Date | null;
  declare currentStep: number;
  declare completedSteps: number[];
  declare onboardingComplete: boolean;
  declare goal: string;
  declare goalDescription: string;
  static findByPK: any;
  static findOne: any;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teamSize: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "just-me",
    },

    currentStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    completedSteps: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const value = this.getDataValue("completedSteps");
        return value ? JSON.parse(value) : [];
      },
      set(value: number[]) {
        this.setDataValue("completedSteps", JSON.stringify(value || []));
      },
    },
    onboardingComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  },
);
