export type UpdateUserProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
};

export type CreateUserProfileDto = UpdateUserProfileDto;
