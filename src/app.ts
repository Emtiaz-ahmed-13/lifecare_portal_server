import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5000"],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "lifecare_porter_server running....",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
