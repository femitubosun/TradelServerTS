type SignInUserWithEmailUseCaseReturnTypeUser = {
  identifier: string;
  email: string;
};

export type SignInUserWithEmailUseCaseReturnType = {
  user: SignInUserWithEmailUseCaseReturnTypeUser;
  token: string;
};
