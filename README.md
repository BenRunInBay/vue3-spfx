# Vue 3 + SPFX 1.13.1 + Typescript + Vite

## Sample Vue 3 app built using Vite that is embedded within an SPFX 1.13.1 webpart

The [Microsoft SharePoint Framework (SPFX)](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment) v1.13.1 does not have an option for Vue in their [Yeoman generator](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/scaffolding-projects-using-yeoman-sharepoint-generator). The [PnP/SPFX generator](https://pnp.github.io/generator-spfx/#spfx-generator-version) has not been updated to support Vue 3 nor SPFX 1.13.1. This project serves as a brute-force sample of how you could develop in Vue 3 (and optionally Vite as your build environment) and then incorporate it into the latest version of SPFX webparts.


### Reasons you might use this project
1. You want to develop SPFX webparts (or application extensions) in [Vue 3](https://v3.vuejs.org/)
2. During development you want to take advantage of TDD and hot reloading that Webpack or [Vite](https://vitejs.dev/) provides, which tends to be much faster than the gulp-based SharePoint workbench.
3. You want to use Node v14. Previous versions of SPFX require Node v10 and do not work on later versions, whereas SPFX v1.13.1 works on Node v14.


### Recent improvement in this project
1. Automated the embedding process (post-build)
2. Allowed for unique app IDs for each instance of the webpart so that multiple instances of the same webpart can be used on the same SharePoint page simultaneously.
3. Synchronized the package.json version of the main web app with the webpart's package version and webpart version in webpart/config/package-solution.json

### Improvements to make in the future
1. Create a script to scaffold a new project based on this structure
2. Consider loading Vue3 from cloud rather than embedding in each webpart


## Set up a Vue 3/Vite/SPFX 1.13.1 project
1. Clone this repo to use for your webpart as a template
2. Delete the .git folder and re-initialize this as your own git repo
3. Create your Vue 3 web app in your normal, preferred way, within the top-level of this folder
4. The index.html will allow you to develop and test the webpart web app inside of a simple container to mimick a SharePoint page
5. Delete the contents of the webpart/ folder
6. Generate the SPFX webpart inside of the webpart folder, selecting "No javascript framework":
```shell
yo @microsoft/sharepoint
```
7. If using Vite, modify /vite.config.ts to set the output directory by adding the following **build** and **assetsDir** options:
```javascript
export default defineConfig({
	  plugins: [vue()],
	  build: {
	    outDir: "webpart/src/webparts/assets",
	    assetsDir: "appcode"
	  },
	})
```
8. Replace your webpart.ts file contents with the one from the webpart-template/src/YOURWebpart/ folder
9. Copy the webpart-template/src/lib/ folder into webpart/src/
10. Replace all occurences of UNIQUECLIENTAPP with an ID name representing your web part
11. Test your web part locally:
```shell
npm run dev
```
12. Confirm that you can build the webpart, which should populate the webpart/src/webparts/assets/ folder with the distribution files. This process is repeated when run the make script but it's good to do a test build the first time. Once it appears to build correctly, use the make script going forward to build AND ship the webpart (see next step).
```shell
npm run build
```
13. Build and ship the webpart using:
```shell
./make
```
14. This should create the webpart sharepoint/solution/...sppkg package that you can upload to the SharePoint site's App Catalog
15. Follow the normal procedure for [deploying your webpart to SharePoint](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)
16. When the webpart is initialized, it will:
    - run the render function
    - create an app element
    - call the Vue app scripts to run and populate that element with the Vue app
	- optionally, pass editable properties into the Vue app (see Editable properties below)


### @PnP/SP
If using @pnp/sp to connect with the SharePoint site:
1. Install it at the project web app level (not the webpart/ sub-project):
```shell
npm install @pnp/sp
```
10. Configure 'sp' in src/App.vue with the base path of the SharePoint site containing the web part. See example code in src/App.vue and src/lib/SharePointTools.ts
11. You do not need to initialize 'sp' in the webpart. Just use it directly from the Vue 3 web app.
12. This project is using @pnp/sp v2, not v3 which is the latest


### Editable properties and passing them to the Vue 3 web app
1. Define your editable properties in the webpart/src/webparts/...WebPart.ts file
2. Pass them to the Vue 3 web app in one of several ways:
    - data-attributes on the containing app element that the Vue app can retrieve
    - sessionStorage


### Updating the app (and webpart)
Make changes to the Vue3 app in your normal way. Then:
1. Update package.json version (in the project directory, NOT the webpart/ subdirectory)
2. From the project directory, run:
```shell
./make
```
3. A SharePoint webpart package file with the new version number will be created that you can drag into the site's App Catalog:
webpart/sharepoint/solution/

### TSConfig
These settings in tsconfig.ts may be helpful:
- "skipLibCheck": true // to ignore type errors in packages such as @pnp/sp
- "exclude": ["**/*.stories.ts"] // to ignore react JSX types that don't apply to a Vue app

### package.json settings:
@LOLCATATONIA added these to webpart/package.json but this created build errors for me:
```
"dependencies": {
"@types/react-dom": "16.8.0",
"@types/react": "16.8.0"
}
```
