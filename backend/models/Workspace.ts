import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User";

export class Workspace extends Model {
  declare id: number;
  declare name: string;
  declare userId: number;
}

Workspace.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Workspace" },
);

Workspace.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Workspace, { foreignKey: "userId" });
