"use strict";

import "reflect-metadata";
import { container } from "tsyringe";
import "Config/index";
import "./process";
import { Application } from "Lib/Infra/Internal/Application";
import "Api/Modules/Client/OnboardingAndAuthentication/Events/index";
import "Api/Modules/Client/Order/Events/index";

const app = new Application(container);

app.startApp();
