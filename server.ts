import express from "express";
import ViteExpress from "vite-express";
import { readdirSync, readFileSync } from "fs";
import { EndPointModel, PostConfigModel, GetConfigModel, ApiConfigModel } from "./src/models/EndPointModel";

const app = express();

app.use((req, res, next) => {
  const arrUrl = req.originalUrl.split("/");

  if (arrUrl[1] != "api" || req.originalUrl == "/api") {
    next();
    return;
  }

  const apiTarget = `./public/Endpoints/${arrUrl.splice(2).join("/")}/${req.method}.json`;

  try {
    const rawResponse = readFIle(apiTarget);

    res.send(rawResponse);
  } catch (error) {
    if (error.code == "ENOENT") {
      res.sendStatus(404);
    } else {
      res.status(500).send(error);
    }
  }
});

app.get("/api", (_, res) => {
  const result: EndPointModel[] = [];

  const endpoints = getEndpoints("./public/Endpoints");

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];

    const getResponse = readFIleToObject<string>(`${endpoint}/GET.json`);
    const postResponse = readFIleToObject<string>(`${endpoint}/POST.json`);

    if (!getResponse && !postResponse) continue;

    const getConfig = readFIleToObject<ApiConfigModel>(`${endpoint}/_GET.json`);
    const postConfig = readFIleToObject<ApiConfigModel>(`${endpoint}/_POST.json`);

    const GET: GetConfigModel | undefined = getResponse
      ? {
          config: getConfig,
          response: getResponse,
        }
      : undefined;

    const POST: PostConfigModel | undefined = postResponse
      ? {
          config: postConfig,
          response: postResponse,
        }
      : undefined;

    result.push({
      url: endpoint.replace("./public/Endpoints", "/api"),
      GET,
      POST,
    });
  }

  res.send(JSON.stringify(result));
});

ViteExpress.listen(app, 1551, () => console.log("Server is listening..."));

const getDirectories = (source): string[] => {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const getEndpoints = (root: string, path?: string): string[] => {
  const rootPath = `${root}${path ? `/${path}` : ""}`;

  const endpoints = getDirectories(rootPath);

  const result: string[] = [];

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];

    result.push(`${rootPath}/${endpoint}`, ...getEndpoints(`${rootPath}`, endpoint));
  }

  return result;
};

const readFIle = (filePath: string) => readFileSync(filePath, { encoding: "utf8" });

const readFIleToObject = <T>(filePath: string) => {
  try {
    const rawText = readFIle(filePath);

    return JSON.parse(rawText) as T;
  } catch {
    return undefined;
  }
};
