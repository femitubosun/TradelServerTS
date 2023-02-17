"use strict";

import "reflect-metadata";
import { container } from "tsyringe";
import "Config/index";
import "./process";
import Application from "Lib/Infra/Internal/Application";

export default new Application(container);

import "Lib/Events/index";
