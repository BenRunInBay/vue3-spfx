/**
 * The Webpart container
 * 1. Creates an element for the Vue app to render in
 * 2. Describes editable properties
 * 3. Passes properties to the Vue app
 */
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { getVueDOMElementHTML } from "../../lib/WebpartProperties";

// Make.ps1 utility should automatically update these paths after each build of the Vue app
// using the bundle-webpart-assets.js Node script:
import { renderVue } from "../assets/appcode/index.95f3fcc4.js";
import "../assets/appcode/index.00b8df5b.css";
import "../assets/appcode/vendor.333eb2ee.js";

// update all occurrences of the following two values to represent your specific webpart:
const APPCLIENTID = "UNIQUECLIENTAPP";
const APPNAME = "WEBPART";

// Define the editable properties
export interface IWebpartWebPartProps {
  heading: string;
  description: string;
  listName: string;
}

export default class Vue3ViteWebpartWebPart extends BaseClientSideWebPart<IWebpartWebPartProps> {

  // timer is optional to delay rendering
  private mountingTimer = null;

  public render(): void {

    // get the webpart instance ID from the DOM element containing this webpart
    let instanceId = this.domElement.getAttribute("data-sp-feature-instance-id"),
      containerId = APPCLIENTID + (instanceId ? "-" + instanceId : "");

    this.domElement.innerHTML = "<span></span>";

    // timer is optional to delay rendering when user is editing properties
    // to prevent that constant re-rendering of the webpart
    if (this.mountingTimer) clearTimeout(this.mountingTimer);
    this.mountingTimer = setTimeout(() => {
      this.domElement.innerHTML = getVueDOMElementHTML(containerId, this.properties);
      renderVue(`#${containerId}`);
    }, 500);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.3');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Vue3 Vite SPFX 1.13.1 webpart"
          },
          groups: [
            {
              groupName: "Webpart properties",
              groupFields: [
                PropertyPaneTextField('heading', {
                  label: "Heading"
                }),
                PropertyPaneTextField('description', {
                  label: "Description",
                  multiline: true
                }),
                PropertyPaneTextField('listName', {
                  label: "List name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
