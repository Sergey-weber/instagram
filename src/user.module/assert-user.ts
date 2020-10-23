import { getManager } from 'typeorm';
import { UserModel } from './user-model';

export const assertUser = async (oktaId: string) => {
  const manager = getManager();
  const existingUser = await manager.findOne(UserModel, { where: { oktaId } });

  if( existingUser ) {
    return existingUser;
  }

  const user = new UserModel();

  user.oktaId = oktaId;

  return await manager.save(user);
}