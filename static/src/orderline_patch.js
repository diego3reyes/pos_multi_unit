import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { patch } from "@web/core/utils/patch";
import { formatCurrency } from "@web/core/currency";
import { MultiUnitButton } from "./multi_unit_button";


Orderline.components = {
    ...Orderline.components,
    MultiUnitButton,
};

patch(Orderline.prototype, {
    get lineScreenValues() {
        const vals = super.lineScreenValues;
        const multiUnit = this.line.pos_multi_unit;
        if (!multiUnit || !multiUnit.qty || this.props.mode !== "display") {
            return vals;
        }

        const presentationQty = this.line.qty / multiUnit.qty;
        const presentationPrice = presentationQty
            ? this.line.displayPrice / presentationQty
            : this.line.displayPrice;

        return {
            ...vals,
            unitPart: this.formatMultiUnitQuantity(presentationQty),
            decimalPart: "",
            name: `${multiUnit.name} - ${vals.name}`,
            displayPriceUnit: `${formatCurrency(presentationPrice, this.line.currency.id)} / ${
                multiUnit.name
            }`,
        };
    },

    formatMultiUnitQuantity(quantity) {
        const rounded = Math.round(quantity * 100000) / 100000;
        if (Number.isInteger(rounded)) {
            return `${rounded}`;
        }
        return `${rounded}`.replace(/0+$/, "").replace(/\.$/, "");
    },
});
