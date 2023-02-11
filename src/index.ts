"use strict";

import "reflect-metadata";
import { container } from "tsyringe";
import "dotenv/config";
import "./process";
import Application from "Lib/Infra/Internal/Application";

export default new Application(container);
