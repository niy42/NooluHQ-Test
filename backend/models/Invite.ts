import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { Workspace } from "./Workspace";

export class Invite extends Model {
  declare id: number;
  declare workspaceId: number;
  declare email: string;
  declare token: string;
  declare accepted: boolean;
}

Invite.init(
  {
    email: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    accepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "Invite" },
);

Invite.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(Invite, { foreignKey: "workspaceId" });
