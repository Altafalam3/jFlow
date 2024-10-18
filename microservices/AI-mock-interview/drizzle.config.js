/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:IWqU7YrlM2RJ@ep-divine-fog-a77mbkt2.ap-southeast-2.aws.neon.tech/neondb?sslmode=require',
    }
  };