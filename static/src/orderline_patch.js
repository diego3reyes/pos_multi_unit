import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";
import { formatCurrency } from "@web/core/currency";
import { MultiUnitButton } from "./multi_unit_button";


const QUANTITY_EPSILON = 0.000001;


function parseQuantity(quantity) {
    if (typeof quantity === "number") {
        return quantity;
    }
    if (typeof quantity === "string") {
        return Number(quantity.replace(",", "."));
    }
    return Number.NaN;
}

function almostEqual(first, second) {
    return Math.abs(first - second) < QUANTITY_EPSILON;
}


Orderline.components = {
    ...Orderline.components,
    MultiUnitButton,
};

patch(PosOrderline.prototype, {
    setMultiUnitQuantity(quantity, keepPrice = true) {
        const multiUnit = this.pos_multi_unit;
        if (!multiUnit?.qty) {
            return this.setQuantity(quantity, keepPrice);
        }

        this.pos_multi_unit_skip_quantity_conversion = true;
        try {
            return this.setQuantity(quantity * multiUnit.qty, keepPrice);
        } finally {
            delete this.pos_multi_unit_skip_quantity_conversion;
        }
    },

    setQuantity(quantity, keepPrice) {
        const multiUnit = this.pos_multi_unit;
        if (!multiUnit?.qty || this.pos_multi_unit_skip_quantity_conversion) {
            return super.setQuantity(...arguments);
        }

        const numericQuantity = parseQuantity(quantity);
        if (!Number.isFinite(numericQuantity)) {
            return super.setQuantity(...arguments);
        }

        const currentPresentationQty = this.qty / multiUnit.qty;
        let presentationQty = numericQuantity;
        if (almostEqual(numericQuantity, this.qty + 1)) {
            presentationQty = currentPresentationQty + 1;
        } else if (almostEqual(numericQuantity, this.qty - 1)) {
            presentationQty = currentPresentationQty - 1;
        }

        return this.setMultiUnitQuantity(presentationQty, keepPrice ?? true);
    },
});

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
