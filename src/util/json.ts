import fsPromises from 'fs/promises';
import path from "path";

export async function getLocalData(filePath: string) {
  // Get the path of the json file
  const currentFilePath = path.join(process.cwd(), filePath);
  // Read the json file
  const jsonData = await fsPromises.readFile(currentFilePath);
  // Parse data as json
  const objectData = JSON.parse(jsonData.toString());

  return objectData
}