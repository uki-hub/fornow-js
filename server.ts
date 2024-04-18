import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync, rmSync, statSync } from "fs";
import { EndpointModel, PostConfigModel, GetConfigModel, ApiConfigModel, PostRequestModel } from "./src/models/EndpointModel";
import DelPayloadModel from "./src/models/DelPayloadModel";
import ClearPayloadModel from "./src/models/ClearPayloadModel";
import path from "path";

const app = express();

app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: "100mb",
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "100mb" }));

app.use((req, res, next) => {
  const arrUrl = req.originalUrl.split("/");

  if (arrUrl[1] != "api" || req.originalUrl == "/api") {
    next();
    return;
  }

  const apiTarget = `./public/Endpoints/${arrUrl.splice(2).join("/")}`;

  try {
    if (!existsSync(`${apiTarget}/_REQUEST`)) mkdirSync(`${apiTarget}/_REQUEST`);

    const newFileName = `${formatDateToString()}.json`;

    writeFileSync(`${apiTarget}/_REQUEST/${newFileName}`, JSON.stringify(req.body), "utf8");

    const rawResponse = readFIle(`${apiTarget}/${req.method}.json`);

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
  const result: EndpointModel[] = [];

  const endpoints = getEndpoints("./public/Endpoints");

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];

    const getResponse = readFIleToObject<string>(`${endpoint}/GET.json`);
    const postResponse = readFIleToObject<string>(`${endpoint}/POST.json`);

    if (!getResponse && !postResponse) continue;

    const getConfig = readFIleToObject<ApiConfigModel>(`${endpoint}/_GET.json`);
    const postConfig = readFIleToObject<ApiConfigModel>(`${endpoint}/_POST.json`);

    const requests: PostRequestModel[] = [];
    const reqFiles = readFilesSync(`${endpoint}/_REQUEST`);

    for (let j = 0; j < reqFiles.length; j++) {
      const req = readFIleToObject<string>(`${endpoint}/_REQUEST/${reqFiles[j]}`);

      requests.push({
        fileName: reqFiles[j],
        body: req!,
      });
    }

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
          requests: requests,
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

app.post("/del", (req, res) => {
  try {
    const payload = req.body as DelPayloadModel;

    const apiTarget = `./public/Endpoints/${payload.path.replace("/api/", "")}`;

    const fileTarget = `${apiTarget}/_REQUEST/${payload.reqFile}`;

    rmSync(fileTarget);

    res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      error: error,
    });
  }
});

app.post("/clear", (req, res) => {
  try {
    const payload = req.body as DelPayloadModel;

    const apiTarget = `./public/Endpoints/${payload.path.replace("/api/", "")}/_REQUEST`;

    console.log(apiTarget);

    rmSync(apiTarget, { recursive: true, force: true });

    res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: false,
      error: error,
    });
  }
});

ViteExpress.listen(app, 1551, () => console.log("Server is listening..."));

const getDirectories = (source): string[] => {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name != "_REQUEST")
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

function readFilesSync(dir) {
  const files: string[] = [];

  if (!existsSync(dir)) return [];

  readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    // const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) files.push(`${name}.json`);
  });

  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  return files;
}

function formatDateToString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}${month}${day}-${hours}.${minutes}.${seconds}'${milliseconds}`;
}
