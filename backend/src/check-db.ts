import AppDataSource from '../ormconfig';

async function checkDatabaseConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection successful.');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

checkDatabaseConnection();
