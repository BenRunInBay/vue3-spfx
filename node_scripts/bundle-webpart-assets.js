/*
    Build and ship webpart
    @date 2022-04-13
    This script looks for a built collection of files to reference within the webpart, which will render it.
    See the webpart/src/webparts/Vue3ViteWebPart.ts file for further comments.
*/
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";

const PACKAGE_SOLUTION = "webpart/config/package-solution.json",
  WEBPART_BASE = "webpart/src/webparts",
  ASSETS_BASE = "webpart/src/webparts/assets/appcode",
  WEBPART_SUFFIX = "WebPart.ts",
  INDEX_JS = 'import { renderVue } from "../assets/appcode/index',
  INDEX_CSS = 'import "../assets/appcode/index',
  VENDOR_JS = 'import "../assets/appcode/vendor',
  SUFFIX = '";\n',
  RENDER_PREFIX = "export function renderVue(appID) {\n",
  RENDER_SUFFIX = "}\n";

const logStatus = (message) => {
    if (message) console.log("\n" + message);
  },
  logError = (errorData) => {
    console.error("\nERROR:\n");
    console.error(errorData);
  },
  getPackageVersion = (basePath) => {
    try {
      const pckage = JSON.parse(readFileSync(basePath + "package.json", "utf-8"));
      return pckage.version;
    } catch (e) {
      logError(e);
      return "";
    }
  },
  updatePackageSolutionVersion = (basePath, newVersion) => {
    try {
      let packageSolution = JSON.parse(readFileSync(basePath + PACKAGE_SOLUTION, "utf-8"));
      packageSolution.solution.version = newVersion;
      writeFileSync(basePath + PACKAGE_SOLUTION, JSON.stringify(packageSolution, null, "\t"));
      logStatus("package-solution.json version updated to " + newVersion);
    } catch (e) {
      logError(e);
    }
  },
  getWebpartName = (basePath) => {
    let webpartName = "";
    try {
      readdirSync(basePath + WEBPART_BASE).forEach((file) => {
        let itemPath = basePath + WEBPART_BASE + `/` + file;
        let isDir = statSync(itemPath).isDirectory();
        if (isDir && file != "assets") webpartName = file;
      });
    } catch (e) {
      logError(e);
    }
    return webpartName;
  },
  getAssetFiles = (basePath) => {
    let assetFiles = [];
    try {
      readdirSync(basePath + ASSETS_BASE).forEach((file) => {
        let itemPath = basePath + ASSETS_BASE + `/` + file;
        let isDir = statSync(itemPath).isDirectory();
        if (!isDir) assetFiles.push(file);
      });
    } catch (e) {
      logError(e);
    }
    return assetFiles;
  },
  replaceLine = (textContents, linePrefix, newText, eolText) => {
    if (textContents && linePrefix && newText) {
      let p = textContents.indexOf(linePrefix),
        eol = textContents.indexOf("\n", p);
      if (p >= 0 && eol > p) {
        return textContents.substring(0, p) + linePrefix + newText + eolText + textContents.substring(eol + 1);
      } else return textContents;
    } else return textContents;
  },
  updateRefsInWebpart = (basePath, webpartName, assetFiles) => {
    if (basePath && webpartName && assetFiles) {
      try {
        let webpartFilePath = basePath + WEBPART_BASE + "/" + webpartName + "/" + webpartName + WEBPART_SUFFIX,
          script = readFileSync(webpartFilePath, "utf-8"),
          indexJsAsset = assetFiles.find((file) => file.match(/index\-[\w\d]+.js/gi) != null),
          indexCssAsset = assetFiles.find((file) => file.match(/index\-[\w\d]+.css/gi) != null),
          vendorJsAsset = assetFiles.find((file) => file.match(/vendor\-[\w\d]+.js/gi) != null);
        if (script && indexJsAsset && indexCssAsset) {
          script = replaceLine(script, INDEX_JS, indexJsAsset.replace("index", ""), SUFFIX);
          script = replaceLine(script, INDEX_CSS, indexCssAsset.replace("index", ""), SUFFIX);
          if (vendorJsAsset) script = replaceLine(script, VENDOR_JS, vendorJsAsset.replace("vendor", ""), SUFFIX);
        }
        writeFileSync(webpartFilePath, script);
        logStatus("Webpart script references new assets.");
      } catch (e) {
        logError(e);
      }
    }
  },
  addRenderFn = (assetsBase, assetFiles, prefix, suffix) => {
    if (assetsBase) {
      try {
        let indexJsAsset = assetFiles.find((file) => file.match(/index\-[\w\d]+.js/gi) != null);
        if (indexJsAsset) {
          let script = readFileSync(assetsBase + indexJsAsset, "utf-8"),
            varCodePos = script.lastIndexOf("var App");
          if (varCodePos > 0) {
            let renderFn = script.substring(varCodePos);
            script = script.substring(0, varCodePos) + "\n\n";
            renderFn = renderFn.replace(/\"\#[\w\d\-]+\"/, "appID");
            script = script + prefix + renderFn + suffix;
            writeFileSync(assetsBase + indexJsAsset, script);
            logStatus("App script updated with render function.");
          }
        } else logError("Can't find index.js asset.");
      } catch (e) {
        logError(e);
      }
    }
  },
  run = () => {
    let basePath = process.cwd() + "\\",
      version = getPackageVersion(basePath);
    if (version) {
      let webpartName = getWebpartName(basePath);
      logStatus("Build and ship webpart: " + webpartName);
      updatePackageSolutionVersion(basePath, version + ".0");
      let assetFiles = getAssetFiles(basePath);
      logStatus("Bundle assets: " + assetFiles.join(", "));
      updateRefsInWebpart(basePath, webpartName, assetFiles);
      addRenderFn(ASSETS_BASE + "/", assetFiles, RENDER_PREFIX, RENDER_SUFFIX);
      console.log("\n\n");
    }
  };

run();
