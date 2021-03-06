/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import { IShortcutView } from "./Applications.d";
import { BarApplication } from "./Applications";

/**
 * 业务对象快捷应用
 */
export abstract class ShortcutApplication<T extends IShortcutView> extends BarApplication<T> {

    /** 注册视图，重载需要回掉此方法 */
    protected registerView(): void {
        super.registerView();
    }
}