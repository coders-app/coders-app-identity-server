export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserData extends Omit<UserCredentials, "password"> {
  name: string;
}

export interface UserStructure
  extends UserData,
    Pick<UserCredentials, "password"> {
  isAdmin: boolean;
  isActive: boolean;
}

export interface UserWithId extends UserStructure {
  _id: string;
}
