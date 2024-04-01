export type CreateGroupDto = {
  name: string;
  description: string;
  parentGroupId?: string;
};

export type UpdateGroupDto = {
  name?: string;
  description?: string;
};
