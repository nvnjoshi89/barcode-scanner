export enum SuccessEnum {
  SUCCESS = '2000',
  UPDATE_SUCCESS = '2001',
  DELETE_SUCCESS = '2002',
  CREATE_SUCCESS = '2003',
  FETCH_SUCCESS = '2004',
  LOGIN_SUCCESS = '2005',
  SET_SUCCESS = '2006',
}

export const successValues: Record<string, string> = {
  [SuccessEnum.SUCCESS]: 'success',
  [SuccessEnum.UPDATE_SUCCESS]: 'update.success',
  [SuccessEnum.DELETE_SUCCESS]: 'delete.success',
  [SuccessEnum.CREATE_SUCCESS]: 'create.success',
  [SuccessEnum.FETCH_SUCCESS]: 'fetch.success',
  [SuccessEnum.LOGIN_SUCCESS]: 'login.success',
  [SuccessEnum.SET_SUCCESS]: 'set.success',
};
