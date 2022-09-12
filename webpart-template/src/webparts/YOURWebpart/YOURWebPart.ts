/**
 * The Webpart container
 * 
 * REPLACE the contents of your webpart with this code
 * REPLACE all occurrences of UNIQUECLIENTAPP across the entire project (root and webpart/) with an ID value to represent your specific webpart
 * MODIFY getPropertyPaneConfiguration() with your editable properties
 * 
 * This webpart will:
 * 1. Create an element for the Vue app to render in
 * 2. Describe editable properties
 * 3. Passes the properties to the Vue app
 */
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { getVueDOMElementHTML } from "../../lib/WebpartProperties";

// The make.ps1 utility should automatically update the following paths after each build of the Vue app
// using the bundle-webpart-assets.js Node script:
import { renderVue } from "../assets/appcode/index.ID.js";
import "../assets/appcode/index.ID.css";
// import "../assets/appcode/vendor.ID.js";

// Update all occurrences of the following value to represent your specific webpart:
const APPCLIENTID = "UNIQUECLIENTAPP";

// Define the editable properties
export interface IWebpartWebPartProps {
  heading: string;
  description: string;
  listName: string;
}

export default class Vue3ViteWebpartWebPart extends BaseClientSideWebPart<IWebpartWebPartProps> {

  // timer is optional to delay rendering
  private mountingTimer: any = null;

  public render(): void {

    // get the webpart instance ID from the DOM element containing this webpart
    let instanceId = this.context.instanceId,
      containerId = APPCLIENTID + (instanceId ? "-" + instanceId : "");

    this.domElement.innerHTML = "<span></span>";

    // timer is optional to delay rendering when user is editing properties
    // to prevent that constant re-rendering of the webpart
    if (this.mountingTimer) clearTimeout(this.mountingTimer);
    this.mountingTimer = setTimeout(() => {
      // insert the Vue app containing element with property values included
      this.domElement.innerHTML = getVueDOMElementHTML(containerId, this.properties, instanceId);
      // call the Vue render function
      renderVue(`#${containerId}`);
    }, 500);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // Modify this section with editable properties you want to provide to your webpart
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Vue3 Webpart"
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
