import { EventEmitter } from "events";
import { OnboardingAndAuthenticationEventTypesEnum } from "Api/Modules/Client/OnboardingAndAuthentication/TypeChecking/GeneralPurpose/OnboardingAndAuthenticationEventTypesEnum";
import { UserListener } from "Api/Modules/Client/OnboardingAndAuthentication/Events/Listeners/UserListener";

export const Event: EventEmitter = new EventEmitter();

Event.on(
  OnboardingAndAuthenticationEventTypesEnum.user.signIn,
  UserListener.onUserSignIn
);
Event.on(
  OnboardingAndAuthenticationEventTypesEnum.user.signUp,
  UserListener.onUserSignUp
);
