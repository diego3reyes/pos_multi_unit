import { Component } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { _t } from "@web/core/l10n/translation";


export class MultiUnitPopup extends Component {
    static template = "pos_multi_unit.MultiUnitPopup";
    static components = { Dialog };
    static props = {
        baseUnit: Object,
        packagings: Array,
        getPayload: Function,
        close: Function,
    };

    get title() {
        return _t("Seleccionar presentacion");
    }

    selectOption(option) {
        this.props.getPayload(option);
        this.props.close();
    }

    formatPrice(price) {
        return this.env.utils.formatCurrency(price || 0);
    }
}
