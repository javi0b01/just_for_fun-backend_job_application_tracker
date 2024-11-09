import Record from '../models/recordModel';
import { ProfileCodes } from '../enums/profileEnum';

export async function getRecord(id: string) {
  try {
    const recordFound = await Record.findById(id);
    if (recordFound) return recordFound;
    else return null;
  } catch (error) {
    console.warn('getRecord | error caught');
  }
}

export async function setUserProfile(id: string) {
  await Record.findByIdAndUpdate(id, {
    profile: ProfileCodes.User,
  });
}
