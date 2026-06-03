from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    pos_product_uom_ids = fields.One2many(
        comodel_name="product.uom",
        related="product_variant_id.product_uom_ids",
        string="Presentaciones POS",
        readonly=False,
    )
