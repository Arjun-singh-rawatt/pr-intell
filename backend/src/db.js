export async function connectDB() {
  // The app is currently using a file-based store rather than a live database.
  // This keeps startup simple and avoids crashing when no MongoDB connection is configured.
  return true;
}
