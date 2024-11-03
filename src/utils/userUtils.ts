import User from '../models/userModel';

export async function deleteUser(id: string) {
  await User.findOneAndDelete({ recordId: id });
}
