import { AccessToken, ApiResponse } from '../types';

import APIService from './api.service';

export default class AuthService extends APIService {
  signup = async (
    firstName: string,
    lastName: string,
    username: string,
    customer_type: string,
    password: string,
  ): Promise<ApiResponse<void>> =>
    this.apiClient.post('/accounts', {
      first_name: firstName,
      last_name: lastName,
      username: username,
      customer_type: customer_type,
      password: password,
    });

  login = async (
    username: string,
    password: string,
  ): Promise<ApiResponse<AccessToken>> => {
    return this.apiClient.post('/access-tokens', {
      username: username,
      password: password,
    });
  };
}
