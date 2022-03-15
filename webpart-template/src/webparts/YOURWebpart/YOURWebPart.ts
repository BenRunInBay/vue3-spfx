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
import { renderVue } from "../assets/appcode/index.ID.js";
import "../assets/appcode/index.ID.css";
import "../assets/appcode/vendor.ID.js";

// update all occurrences of the following value to represent your specific webpart:
const APPCLIENTID = "UNIQUECLIENTAPP";

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

    let instanceId = this.domElement.getAttribute("data-sp-feature-instance-id"),
      containerId = APPCLIENTID + (instanceId ? "-" + instanceId : "");

    this.domElement.innerHTML = "<span></span>";

    // timer is optional to delay rendering when user is editing properties
    if (this.mountingTimer) clearTimeout(this.mountingTimer);
    this.mountingTimer = setTimeout(() => {
      this.domElement.innerHTML = getVueDOMElementHTML(containerId, this.properties);
      renderVue(`#${containerId}`);
    }, 500);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.2');
  }

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
