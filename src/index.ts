"use strict";

import "reflect-metadata";
import { container } from "tsyringe";
import "dotenv/config";
import Application from "Lib/Application";

export default new Application(container);
