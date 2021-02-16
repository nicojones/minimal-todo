export interface ISignupForm {
  email: string;
  password: string;
  name: string;
}

export type ISignupFormError = { [key in keyof Partial<ISignupForm>]: string};
