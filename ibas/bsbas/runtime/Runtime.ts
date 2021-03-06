/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

// 模块索引文件，此文件集中导出类

import { KeyValue, objects, i18n, List, ArrayList } from "../../bobas/index";
import { IModule } from "../core/index";
import { IUser } from "../systems/index";

/** 变量-用户ID */
export const VARIABLE_NAME_USER_ID: string = "${USER_ID}";
/** 变量-用户编码 */
export const VARIABLE_NAME_USER_CODE: string = "${USER_CODE}";
/** 变量-用户名称 */
export const VARIABLE_NAME_USER_NAME: string = "${USER_NAME}";
/** 变量-是否超级用户 */
export const VARIABLE_NAME_USER_SUPER: string = "${USER_SUPER}";
/** 变量-用户归属 */
export const VARIABLE_NAME_USER_BELONG: string = "${USER_BELONG}";
/** 变量-用户口令 */
export const VARIABLE_NAME_USER_TOKEN: string = "${USER_TOKEN}";
/** 变量管理员 */
export class VariablesManager {
    /** 运行中的变量 */
    private variables: Map<string, KeyValue>;
    /** 注册系统观察者 */
    register(watcher: ISystemWatcher): void;
    /** 注册变量 */
    register(variable: KeyValue): void;
    /** 注册变量 */
    register(key: string, value: any): void;
    /** 注册变量 */
    register(): void {
        let variable: KeyValue;
        if (arguments.length === 1) {
            if (objects.instanceOf(arguments[0], KeyValue)) {
                variable = arguments[0];
            } else if (arguments[0].user instanceof Function &&
                arguments[0].modules instanceof Function) {
                // 系统观察者
                this.watcher = arguments[0];
            }
        } else if (arguments.length === 2) {
            variable = new KeyValue();
            variable.key = arguments[0];
            variable.value = arguments[1];
        }
        if (!objects.isNull(variable)) {
            if (objects.isNull(this.variables)) {
                this.variables = new Map();
            }
            this.variables.set(variable.key, variable);
        }
    }
    /** 获取所有变量 */
    all(): KeyValue[] {
        let values: Array<KeyValue> = new Array<KeyValue>();
        for (let item of this.variables.values()) {
            values.push(item);
        }
        return values;
    }
    /** 获取变量 */
    get(key: string): KeyValue {
        if (objects.isNull(this.variables)) {
            return null;
        }
        if (this.variables.has(key)) {
            return this.variables.get(key);
        }
        return null;
    }
    /** 获取变量 */
    getValue(key: string): any {
        let value: any = this.get(key);
        if (objects.isNull(value)) {
            return null;
        }
        return value.value;
    }
    /** 系统用户 */
    private watcher: ISystemWatcher;
    getWatcher(): ISystemWatcher {
        if (objects.isNull(this.watcher)) {
            return {
                modules(): List<IModule> {
                    return new ArrayList();
                },
                user(): IUser {
                    return {
                        id: undefined,
                        name: undefined,
                        code: undefined,
                        super: false,
                        token: undefined,
                        belong: undefined,
                    };
                }
            };
        }
        return this.watcher;
    }
}
/** 系统运行状态观察者 */
export interface ISystemWatcher {
    /** 运行的模块 */
    modules(): List<IModule>;
    /** 系统用户 */
    user(): IUser;
}