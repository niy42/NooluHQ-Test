import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  logging: false,
  // dialect: "sqlite",
  // storage: "./data.sqlite",
});

export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Unable to connect:", err);
  }
}
