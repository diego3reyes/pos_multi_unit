import uuid

from odoo import api, fields, models


class ProductUom(models.Model):
    _inherit = "product.uom"

    barcode = fields.Char(default=lambda self: self._default_pos_multi_unit_barcode())
    available_in_pos = fields.Boolean(
        string="Disponible en POS",
        default=False,
        help="Si esta activo, esta presentacion aparecera como opcion en el POS.",
    )
    pos_price = fields.Float(
        string="Precio POS",
        digits="Product Price",
        help="Precio de venta de esta presentacion en el Punto de Venta.",
    )
    currency_id = fields.Many2one(
        comodel_name="res.currency",
        related="product_id.currency_id",
        readonly=True,
    )

    @api.model
    def _default_pos_multi_unit_barcode(self):
        return f"PMU-{uuid.uuid4().hex[:12].upper()}"

    @api.model
    def _load_pos_data_fields(self, config):
        result = super()._load_pos_data_fields(config)
        for field_name in ("available_in_pos", "pos_price"):
            if field_name not in result:
                result.append(field_name)
        return result
