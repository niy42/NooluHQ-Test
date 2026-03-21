import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// for local testing
// export const sequelize = new Sequelize({
//   // dialect: "postgres",
//   // logging: false,
//   dialect: "sqlite",
//   storage: "./data.sqlite",
// });

export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Unable to connect:", err);
  }
}
