import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "../config/db";

export const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  console.log("Checking for pending migrations...");
  await umzug.up();
  console.log("Migrations completed!");
};
