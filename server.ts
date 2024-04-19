import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync, rmSync, statSync } from "fs";
import path from "path";
import RequestDelModel from "./src/models/requests/RequestDelModel";
import RequestClearModel from "./src/models/requests/RequestClearModel";
import LogFileModel from "./src/models/LogFileModel";
import ResponseGetEndpointsModel from "./src/models/responses/ResponseGetEndpointsModel";
import PayloadGetEndpointsModel, { PayloadEndpointDataModel } from "./src/models/payloads/PayloadGetEndpointsModel";

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
  const result: PayloadGetEndpointsModel = {
    endpoints: [],
  };

  const endpoints = getEndpoints("./public/Endpoints");

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];

    const getResponse = readFIleToObject<Object>(`${endpoint}/GET.json`);
    const postResponse = readFIleToObject<Object>(`${endpoint}/POST.json`);

    if (!getResponse && !postResponse) continue;

    const getConfig = readFIleToObject<Object>(`${endpoint}/_GET.json`);
    const postConfig = readFIleToObject<Object>(`${endpoint}/_POST.json`);

    const logFiles: LogFileModel[] = [];
    const reqFiles = readFilesSync(`${endpoint}/_REQUEST`);

    for (let j = 0; j < reqFiles.length; j++) {
      const req = readFIleToObject<Object>(`${endpoint}/_REQUEST/${reqFiles[j]}`);

      logFiles.push({
        fileName: reqFiles[j],
        body: req!,
      });
    }

    const GET: PayloadEndpointDataModel | undefined = getResponse
      ? {
          config: getConfig,
          response: getResponse,
        }
      : undefined;

    const POST: PayloadEndpointDataModel | undefined = postResponse
      ? {
          config: postConfig,
          response: postResponse,
          logs: logFiles,
        }
      : undefined;

    result.endpoints.push({
      url: endpoint.replace("./public/Endpoints", "/api"),
      GET,
      POST,
    });
  }

  res.send(JSON.stringify(result));
});

app.post("/del", (req, res) => {
  try {
    const payload = req.body as RequestDelModel;

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
    const payload = req.body as RequestClearModel;

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
