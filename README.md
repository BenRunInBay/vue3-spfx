# Vue 3 + SPFX 1.12 + Typescript + Vite
As of 2021 October

## Sample Vue 3 app built using Vite that is embedded within an SPFX 1.12 webpart

The [Microsoft SharePoint Framework (SPFX)](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment) v1.12 does not have an option for Vue in their [Yeoman generator](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/scaffolding-projects-using-yeoman-sharepoint-generator). The [PnP/SPFX generator](https://pnp.github.io/generator-spfx/#spfx-generator-version) has not been updated to support Vue 3 nor SPFX 1.12. This project serves as a brute-force sample of how you could develop in Vue 3 (and optionally Vite as your build environment) and then incorporate it into the latest version of SPFX webparts.


### Reasons you might use this project
1. You want to develop SPFX webparts (or application extensions) in [Vue 3](https://v3.vuejs.org/)
2. During development you want to take advantage of TDD and hot reloading that Webpack or [Vite](https://vitejs.dev/) provides, which tends to be much faster than the gulp-based SharePoint workbench.
3. You want to use Node v14. Previous versions of SPFX require Node v10 and do not work on later versions, whereas SPFX v1.12 works on Node v14.


### Areas for improvement in this project
1. Automate the embedding process (post-build)
2. Allow for unique app IDs for each instance of the webpart so that multiple instances of the same webpart can be used on the same SharePoint page simultaneously.


## How to set up a Vue 3/Vite/SPFX 1.12 project
1. Create your Vue 3 web app in your normal, preferred way.
2. Develop and test the web app inside of a simple container to mimick a SharePoint page.
3. Create a **webpart** sub-folder within the web app project folder. This will contain the @Microsoft/SharePoint-generated project.
4. Generate the SPFX webpart inside of the webpart folder, selecting "No javascript framework":
```shell
yo @microsoft/sharepoint
```
7. If using Vite, modify /vite.config.ts to set the output directory by adding the following **build** and **assetsDir** options:
```javascript
export default defineConfig({
	  plugins: [vue()],
	  build: {
	    outDir: "webpart/src/webparts/assets"
	  },
	  assetsDir: "appcode"
	})
```
8. Modify /index.html to use a more specific app ID (rather than just #app):
```html
<div id="unique-app-id"></div>
```
9. Build your Vue 3 web app using npm run build
10. The build process should place the files in webpart/src/assets (instead of the default location dist/)
11. Open the webpart/src/webparts/...Webpart/ directory and edit the webpart.ts file
12. Import the .js and .css assets built to the ../assets/appcode/ folder. For example:
```javascript
import "../assets/appcode/index.99fcc87e.css";
import "../assets/appcode/vendor.635794a4.js";
```
13. Do not import the main application file (index...js) at this point, as it will run before the containing app element is created.
14. Reference the unique ID you will give this application's element in the page and the filename of the Vue app file (usually index....js):
```javascript
const APPID = "unique-app-id";
const APPFILENAME = "index.deefa9b4.js";
```
15. In the render() function:
```javascript
public render(): void {
    this.domElement.innerHTML = `<div id="${APPID}"></div>`;
    require("../assets/appcode/" + APPFILENAME);
}
```
16. Bundle and package the webpart from within the webpart/ folder:
```shell
gulp bundle --ship
gulp package-solution --ship
```
17. When the webpart is initialized, it will:
    - import the dependencies from step 12
    - run the render function
    - create an app element
    - call the Vue app scripts to run and populate that element with the Vue app
18. Follow the normal procedure for [deploying your webpart to SharePoint](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

### Git repo
You might want to keep everything (the Vue3 web app and webpart sub-project as one git repo). In which case:
1. Add the following to the web app's .gitignore and delete the webpart/.gitignore:
```text
webpart/.vscode
webpart/dist
webpart/lib
webpart/node_modules
webpart/release
webpart/sharepoint
webpart/temp
```
2. Initialize the git repo from the main web app directory


### @PnP/SP
If using @pnp/sp to connect with the SharePoint site:
1. Install it at the web app level (not the web part sub-project):
```shell
npm install @pnp/sp
```
10. Configure 'sp' in src/App.vue with the base path of the SharePoint site containing the web part. See example code in src/App.vue and src/lib/SharePointTools.ts
11. You do not need to initialize 'sp' in the webpart. Just use it directly from the Vue 3 web app.


### Editable properties and passing them to the Vue 3 web app
1. Define your editable properties in the webpart/src/webparts/...WebPart.ts file
2. Pass them to the Vue 3 web app in one of several ways:
    - data-attributes on the containing app element that the Vue app can retrieve
    - sessionStorage


### Updating the app (and webpart)
After making, previewing and testing changes to the Vue 3 app, you'll need to follow this procedure for updating the webpart:
1. Build the web app using npm run build
2. Update the webpart version in webpart/config/package-solution.json
3. Update the filename references in the webpart.ts file:
```javascript
import "../assets/appcode/index.99fcc87e.css";
import "../assets/appcode/vendor.635794a4.js";
const APPID = "unique-app-id";
const APPFILENAME = "index.deefa9b4.js";
```
4. Bundle and package as you had done before
```shell
gulp bundle --ship
gulp package-solution --ship
```

### TSConfig
These settings in tsconfig.ts may be helpful:
- "skipLibCheck": true // to ignore type errors in packages such as @pnp/sp
- "exclude": ["**/*.stories.ts"] // to ignore react JSX types that don't apply to a Vue app: