export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserData extends UserCredentials {
  name: string;
}

export interface UserStructure extends UserData {
  isAdmin: boolean;
  isActive: boolean;
}

export interface UserWithId extends UserStructure {
  _id: string;
}
