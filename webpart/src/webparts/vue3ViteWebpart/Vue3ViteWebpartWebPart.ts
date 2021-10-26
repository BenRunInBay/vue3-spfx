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
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'Vue3ViteWebpartWebPartStrings';

// Update these paths after each build of the Vue app
import "../assets/appcode/index.99fcc87e.css";
import "../assets/appcode/vendor.635794a4.js";
const APPID = "vue3vitewebpartapp";
const APPFILENAME = "index.deefa9b4.js";

// Define the editable properties
export interface IWebpartWebPartProps {
  heading: string;
  description: string;
  listName: string;
}

export default class Vue3ViteWebpartWebPart extends BaseClientSideWebPart<IWebpartWebPartProps> {

  public render(): void {
    // Optional: render different content when in edit mode
    if (this.displayMode == DisplayMode.Edit)
      this.domElement.innerHTML = `<div id="${APPID}"><h3>Vue 3 Vite Web App</h3><p>Select this webpart and click the pencil icon to edit properties.</p></div>`;
    else {
      // Create the element where the Vue will render. Be sure to match the ID value.
      // Pass properties as data-attributes
      this.domElement.innerHTML = `<div id="${APPID}" data-list-name="${encodeURIComponent(this.properties.listName)}" data-heading="${encodeURIComponent(this.properties.heading)}" data-description="${encodeURIComponent(this.properties.description)}"></div>`;
      require("../assets/appcode/" + APPFILENAME);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.2');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
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
