import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { School } from "./entity/School";

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(
      connection.manager.create(User, {
        email: "jdm109@duk.edu",
        firstName: "Jackson",
        lastName: "McNabb",
        address: "102 Example Lane",
        longitude: 32.5,
        latitude: 432.54,
        isAdmin: false,
      })
    );

    // await connection.manager.save(
    //   connection.manager.create(School, {

    //   })
    // )

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );

    console.log();
  })
  .catch((error) => console.log(error));
