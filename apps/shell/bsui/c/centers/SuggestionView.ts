﻿/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

/// <reference path="../../../../../openui5/typings/index.d.ts" />
import { ISuggestionView } from "../../../../../ibas/bsbas/systems/index";
import { BOResidentView } from "../../../../../ibas/bsbas/index";

/**
 * 视图-建议
 */
export class SuggestionView extends BOResidentView implements ISuggestionView {
    /** 绘制工具条视图 */
    darwBar(): any {
        let that = this;
        return new sap.m.Button("", {
            icon: "sap-icon://discussion-2",
            type: sap.m.ButtonType.Transparent,
            press: function (): void {
                that.fireViewEvents(that.showFullViewEvent);
            }
        });
    }
    /** 激活完整视图事件 */
    showFullViewEvent: Function;
    /** 绘制视图 */
    darw(): any {
    }
}