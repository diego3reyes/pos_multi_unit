{
    "name": "POS Multi Unit",
    "version": "19.0.1.0.0",
    "summary": "Selector de presentaciones en POS sin escaner de codigo de barras",
    "description": """
        Permite al cajero seleccionar la presentacion de un producto directamente
        desde la linea del carrito del POS.
    """,
    "category": "Point of Sale",
    "author": "Grupo Dinora",
    "depends": ["point_of_sale"],
    "data": [
        "views/product_uom_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_multi_unit/static/src/multi_unit_popup.js",
            "pos_multi_unit/static/src/multi_unit_popup.xml",
            "pos_multi_unit/static/src/multi_unit_button.js",
            "pos_multi_unit/static/src/multi_unit_button.xml",
            "pos_multi_unit/static/src/orderline_patch.js",
            "pos_multi_unit/static/src/orderline_patch.xml",
        ],
    },
    "installable": True,
    "auto_install": False,
    "license": "LGPL-3",
}
