type SignInUserWithEmailUseCaseReturnTypeUser = {
  identifier: string;
  email: string;
};

export type SignInUserWithEmailReturnType = {
  user: SignInUserWithEmailUseCaseReturnTypeUser;
  token: string;
};
