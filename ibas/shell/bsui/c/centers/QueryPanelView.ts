﻿/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { IBOInfo, IBOPropertyInfo, IBORepositorySystem, Factories } from "ibas/bsbas/systems/index";
import * as openui5 from "../../../../../openui5/index";
import { IQueryPanelView } from "../../../bsapp/centers/QueryPanel";
import { UserQuery } from "../../../borep/bo/Systems";

/**
 * 视图-查询面板
 */
export class QueryPanelView extends ibas.BOPanelView implements IQueryPanelView {
    /** 查询 */
    searchEvent: Function;
    /** 删除查询 */
    deleteQueryEvent: Function;
    /** 保存查询 */
    saveQueryEvent: Function;
    /** 添加查询条件 */
    addQueryConditionEvent: Function;
    /** 移出查询 */
    removeQueryConditionEvent: Function;
    /** 查询内容 */
    get searchContent(): string {
        return this.search.getValue();
    }
    set searchContent(value: string) {
        this.search.setValue(value);
    }
    /** 查询内容 */
    get usingQuery(): string {
        return this.baseOn.getSelectedKey();
    }
    set usingQuery(value: string) {
        this.baseOn.setSelectedKey(value);
    }
    /** 绘制工具条视图 */
    darwBar(): any {
        if (ibas.objects.isNull(this.bar)) {
            let that: this = this;
            this.search = new sap.m.SearchField("", {
                search: function (): void {
                    that.fireViewEvents(that.searchEvent);
                }
            });
            this.baseOn = new sap.m.Select("", {
                placeholder: ibas.i18n.prop("shell_base_on_criteria"),
                width: "55%",
                maxWidth: "55%"
            });
            this.config = new sap.m.Button("", {
                icon: "sap-icon://filter",
                type: sap.m.ButtonType.Transparent,
                press: function (): void {
                    that.fireViewEvents(that.showFullViewEvent);
                }
            });
            this.bar = new sap.m.Toolbar("", {
                width: "100%",
                design: sap.m.ToolbarDesign.Auto,
                content: [
                    this.search,
                    this.baseOn,
                    this.config
                ]
            });
        }
        return this.bar;
    }
    private bar: sap.m.Toolbar;
    private search: sap.m.SearchField;
    private config: sap.m.Button;
    private baseOn: sap.m.Select;
    /** 显示可用查询 */
    showQueries(datas: ibas.KeyValue[]): void {
        this.baseOn.removeAllItems();
        for (let item of datas) {
            this.baseOn.addItem(new sap.ui.core.Item("", {
                key: item.key,
                text: item.value
            }));
        }
        if (this.baseOn.getItems().length > 0) {
            this.baseOn.setSelectedKey("0");
        }
    }
    /** 显示查询内容 */
    showQuery(data: UserQuery): void {
        this.boName = data.target;
        this.form.setModel(new sap.ui.model.json.JSONModel(data));
    }
    protected boName: string;
    /** 显示查询条件 */
    showQueryConditions(datas: ibas.ICondition[]): void {
        if (ibas.objects.isNull(this.table)) {
            // 尚未初始化表格
            if (!ibas.objects.isNull(this.boName)) {
                let that: this = this;
                let boRepository: IBORepositorySystem = Factories.systemsFactory.createRepository();
                boRepository.fetchBOInfos({
                    boName: this.boName,
                    boCode: null,
                    onCompleted(opRslt: ibas.IOperationResult<IBOInfo>): void {
                        let boInfo: IBOInfo = opRslt.resultObjects.firstOrDefault();
                        if (ibas.objects.isNull(boInfo)) {
                            that.table = that.createTable([]);
                            that.form.addContent(that.table);
                        } else {
                            that.table = that.createTable(boInfo.properties);
                            that.form.addContent(that.table);
                        }
                        that.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    }
                });
            } else {
                this.table = this.createTable([]);
                this.form.addContent(this.table);
                this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
            }
        } else {
            this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        }
    }
    protected getCharListItem(char: string): sap.ui.core.ListItem[] {
        // 获取重复的字符
        let count: number = 4;
        let items: Array<sap.ui.core.ListItem> = [];
        items.push(new sap.ui.core.ListItem("", {
            key: 0,
            text: "",
        }));
        let vChar: string = char;
        for (let i: number = 1; i < count; i++) {
            items.push(new sap.ui.core.ListItem("", {
                key: i,
                text: vChar,
            }));
            vChar = vChar + char;
        }
        return items;
    }
    private table: sap.ui.table.Table;
    protected getPropertyListItem(properies: IBOPropertyInfo[]): sap.ui.core.ListItem[] {
        let items: Array<sap.ui.core.ListItem> = [];
        items.push(new sap.ui.core.ListItem("", {
            key: "",
            text: ibas.i18n.prop("shell_please_chooose_data", ""),
        }));
        if (!ibas.objects.isNull(properies)) {
            for (let property of properies) {
                items.push(new sap.ui.core.ListItem("", {
                    key: property.property,
                    text: property.description,
                }));
            }
        }
        return items;
    }
    private createTable(properies: IBOPropertyInfo[]): sap.ui.table.Table {
        let that: this = this;
        let table: sap.ui.table.Table = new sap.ui.table.Table("", {
            extension: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_add"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://add",
                        press: function (): void {
                            that.fireViewEvents(that.addQueryConditionEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_remove"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://less",
                        press: function (): void {
                            let selected: any = openui5.utils.getTableSelecteds(that.table).firstOrDefault();
                            that.fireViewEvents(that.removeQueryConditionEvent, selected);
                        }
                    })
                ]
            }),
            visibleRowCount: 5,
            enableSelectAll: false,
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_relationship"),
                    width: "100px",
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: openui5.utils.createComboBoxItems(ibas.emConditionRelationship)
                    }).bindProperty("selectedKey", {
                        path: "relationship",
                        type: "sap.ui.model.type.Integer"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_bracketopen"),
                    width: "100px",
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: this.getCharListItem("(")
                    }).bindProperty("selectedKey", {
                        path: "bracketOpen",
                        type: "sap.ui.model.type.Integer"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_alias"),
                    width: "200px",
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: this.getPropertyListItem(properies)
                    }).bindProperty("selectedKey", {
                        path: "alias",
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_operation"),
                    width: "140px",
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: openui5.utils.createComboBoxItems(ibas.emConditionOperation)
                    }).bindProperty("selectedKey", {
                        path: "operation",
                        type: "sap.ui.model.type.Integer"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_value"),
                    width: "120px",
                    template: new sap.m.Input("", {
                    }).bindProperty("value", {
                        path: "value"
                    }),
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("shell_query_condition_bracketclose"),
                    width: "100px",
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: this.getCharListItem(")")
                    }).bindProperty("selectedKey", {
                        path: "bracketClose",
                        type: "sap.ui.model.type.Integer"
                    })
                })
            ]
        });
        return table;
    }
    protected form: sap.ui.layout.VerticalLayout;
    /** 绘制视图 */
    darw(): any {
        if (this.form != null) {
            this.form.destroy(true);
            this.form = null;
        }
        if (this.table != null) {
            this.table.destroy(true);
            this.table = null;
        }
        this.boName = null;
        let that: this = this;
        this.form = new sap.ui.layout.VerticalLayout("", {
            width: "100%",
            content: [
                new sap.m.Toolbar("", {
                    content: [
                        new sap.m.Label("", {
                            text: ibas.i18n.prop("shell_query_name"),
                        }),
                        new sap.m.Input("", {
                        }).bindProperty("value", {
                            path: "/name"
                        }),
                        new sap.m.ToolbarSpacer("", { width: "15px" }),
                        new sap.m.RatingIndicator("", {
                            maxValue: 5,
                            tooltip: ibas.i18n.prop("shell_query_order"),
                        }).bindProperty("value", {
                            path: "/order"
                        }),
                        new sap.m.ToolbarSpacer("", { width: "5px" })
                    ]
                })
            ]
        });
        return new sap.m.Dialog("", {
            title: this.title,
            type: sap.m.DialogType.Standard,
            state: sap.ui.core.ValueState.None,
            stretchOnPhone: true,
            horizontalScrolling: true,
            verticalScrolling: true,
            content: [this.form],
            buttons: [
                new sap.m.Button("", {
                    text: ibas.i18n.prop("shell_data_delete"),
                    type: sap.m.ButtonType.Transparent,
                    // icon: "sap-icon://create",
                    press: function (): void {
                        that.fireViewEvents(that.deleteQueryEvent);
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("shell_data_save"),
                    type: sap.m.ButtonType.Transparent,
                    // icon: "sap-icon://accept",
                    press: function (): void {
                        that.fireViewEvents(that.saveQueryEvent);
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("shell_exit"),
                    type: sap.m.ButtonType.Transparent,
                    // icon: "sap-icon://inspect-down",
                    press: function (): void {
                        that.fireViewEvents(that.closeEvent);
                    }
                }),
            ]
        });
    }
}