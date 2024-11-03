import { ProfileCodes, ProfileNames } from '../enums/profileEnum';

export function getProfileCode(name: string = 'guest'): number {
  if (name === 'admin') return ProfileCodes.Admin;
  else if (name === 'user') return ProfileCodes.User;
  else return ProfileCodes.Guest;
}

export function getProfileName(code: number = 300): string {
  if (code === 100) return ProfileNames.Admin;
  else if (code === 200) return ProfileNames.User;
  else return ProfileNames.Guest;
}
