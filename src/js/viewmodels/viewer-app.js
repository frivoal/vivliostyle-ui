/*
 * Copyright 2015 Vivliostyle Inc.
 *
 * This file is part of Vivliostyle UI.
 *
 * Vivliostyle UI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Vivliostyle UI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Vivliostyle UI.  If not, see <http://www.gnu.org/licenses/>.
 */

import ko from "knockout";
import vivliostyle from "../models/vivliostyle";
import DocumentOptions from "../models/document-options";
import ZoomOptions from "../models/zoom-options";
import ViewerOptions from "../models/viewer-options";
import messageQueue from "../models/message-queue";
import Viewer from "./viewer";
import Navigation from "./navigation";
import SettingsPanel from "./settings-panel";
import MessageDialog from "./message-dialog";
import keyUtil from "../utils/key-util";
import urlParameters from "../stores/url-parameters";

function ViewerApp() {
    this.documentOptions = new DocumentOptions();
    this.viewerOptions = new ViewerOptions();
    if (this.viewerOptions.profile()) {
        vivliostyle.profile.profiler.enable();
    }
    this.isDebug = urlParameters.getParameter("debug")[0] === "true";
    this.viewerSettings = {
        userAgentRootURL: urlParameters.getBaseURL() + "resources/",
        viewportElement: document.getElementById("vivliostyle-viewer-viewport"),
        debug: this.isDebug
    };
    this.viewer = new Viewer(this.viewerSettings, this.viewerOptions);
    this.messageDialog = new MessageDialog(messageQueue);

    var settingsPanelOptions = {
        disablePageSizeChange: false,
        disablePageViewModeChange: false
    };

    this.settingsPanel = new SettingsPanel(this.viewerOptions, this.documentOptions, this.viewer, this.messageDialog,
        settingsPanelOptions);

    var navigationOptions = {
        disablePageNavigation: false,
        disableZoom: false,
        disableFontSizeChange: false
    };

    this.navigation = new Navigation(this.viewerOptions, this.viewer, this.settingsPanel, navigationOptions);

    this.handleKey = function(data, event) {
        var key = keyUtil.identifyKeyFromEvent(event);
        var ret = this.settingsPanel.handleKey(key);
        if (ret) {
            ret = this.navigation.handleKey(key);
        }
        return ret;
    }.bind(this);

    this.viewer.loadDocument(this.documentOptions);
}

export default ViewerApp;
