import EventModel from '@/models/EventModel';
import mongoose from 'mongoose';

const databaseConnection = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect('mongodb+srv://certifiedloaded:4111@cluster0.se1ihme.mongodb.net/event');
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw new Error("Database connection failed");
  }
};

export default databaseConnection;


async function deleteExpiredEvents() {
  await databaseConnection();
  const now = new Date();
  await EventModel.deleteMany({
    endDate: { $lt: now },
  });
}

function startCronJob() {
  const job = setInterval(deleteExpiredEvents, 60 * 60 * 1000); 
  return job;
}

startCronJob();

export  { deleteExpiredEvents, startCronJob };