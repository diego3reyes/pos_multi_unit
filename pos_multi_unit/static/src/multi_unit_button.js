import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/hooks/pos_hook";
import { makeAwaitable } from "@point_of_sale/app/utils/make_awaitable_dialog";
import { MultiUnitPopup } from "./multi_unit_popup";


export class MultiUnitButton extends Component {
    static template = "pos_multi_unit.MultiUnitButton";
    static props = {
        line: Object,
    };

    setup() {
        this.pos = usePos();
        this.dialog = useService("dialog");
    }

    get line() {
        return this.props.line;
    }

    get product() {
        return this.line.product_id;
    }

    get packagings() {
        const productUoms = this.pos.models["product.uom"] || [];
        return productUoms
            .filter((packaging) => {
                return (
                    packaging.available_in_pos &&
                    packaging.product_id?.id === this.product.id &&
                    packaging.uom_id
                );
            })
            .map((packaging) => this.preparePackagingOption(packaging));
    }

    get shouldShow() {
        return this.packagings.length > 0 && !this.line.isPartOfCombo?.();
    }

    preparePackagingOption(packaging) {
        const productFactor = this.product.uom_id?.factor || 1;
        const packagingFactor = packaging.uom_id?.factor || productFactor;
        const qty = packagingFactor / productFactor;

        return {
            id: packaging.id,
            name: packaging.uom_id.name || packaging.barcode,
            description: `${qty} ${this.product.uom_id.name || ""}`.trim(),
            qty,
            price: packaging.pos_price,
            packaging,
        };
    }

    getBasePrice() {
        return this.product.product_tmpl_id.getPrice(
            this.line.order_id.pricelist_id,
            1,
            this.line.getPriceExtra(),
            false,
            this.product
        );
    }

    get baseUnit() {
        const unitName = this.product.uom_id?.name || "Unidad";
        return {
            id: "base",
            name: `1 ${unitName}`,
            description: "Unidad base",
            qty: 1,
            price: this.getBasePrice(),
            isBaseUnit: true,
        };
    }

    async openPopup() {
        if (!this.shouldShow) {
            return;
        }

        const payload = await makeAwaitable(this.dialog, MultiUnitPopup, {
            baseUnit: this.baseUnit,
            packagings: this.packagings,
        });

        if (!payload) {
            return;
        }

        if (payload.isBaseUnit) {
            this.line.price_type = "original";
            this.line.setQuantity(1);
            this.line.setUnitPrice(payload.price);
        } else {
            this.line.setQuantity(payload.qty, true);
            this.line.setUnitPrice(payload.price);
            this.line.price_type = "manual";
        }
    }
}
