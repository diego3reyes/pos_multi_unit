from odoo import api, fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    pos_product_uom_ids = fields.One2many(
        comodel_name="product.uom",
        inverse_name="product_id",
        string="Presentaciones POS",
        compute="_compute_pos_product_uom_ids",
        inverse="_inverse_pos_product_uom_ids",
    )

    @api.depends("product_variant_ids.product_uom_ids")
    def _compute_pos_product_uom_ids(self):
        for template in self:
            template.pos_product_uom_ids = template.product_variant_id.product_uom_ids

    def _inverse_pos_product_uom_ids(self):
        for template in self:
            product = template.product_variant_id
            if not product:
                continue
            template.pos_product_uom_ids.filtered(lambda line: not line.product_id).product_id = product
            product.product_uom_ids = template.pos_product_uom_ids
