# POS Multi Unit

Modulo personalizado para Odoo 19 Enterprise que permite seleccionar la presentacion de venta de un producto directamente desde la linea del carrito del Punto de Venta.

El modulo esta pensado para productos que se venden en unidad base y tambien en presentaciones como six pack, caja, paquete u otra unidad configurada en Odoo.

## Compatibilidad

- Odoo 19 Enterprise
- Point of Sale
- Unidades de medida activas

## Que hace

- Agrega campos de configuracion POS al modelo `product.uom`.
- Permite marcar una presentacion como disponible en POS.
- Permite definir un precio POS propio para cada presentacion.
- Muestra un boton `Cambiar presentacion` debajo de la linea seleccionada del carrito.
- Abre un popup con la unidad base y las presentaciones disponibles.
- Al seleccionar una presentacion, actualiza la cantidad y el precio unitario de la linea.
- El inventario se descuenta en unidades base usando la conversion de `uom.uom`.

## Archivos principales

```text
pos_multi_unit/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   ├── product_template.py
│   └── product_uom.py
├── views/
│   └── product_uom_views.xml
└── static/
    └── src/
        ├── multi_unit_button.js
        ├── multi_unit_button.xml
        ├── multi_unit_popup.js
        ├── multi_unit_popup.xml
        ├── orderline_patch.js
        └── orderline_patch.xml
```

## Instalacion

Copiar la carpeta `pos_multi_unit` al directorio de addons personalizados de Odoo 19:

```bash
cp -r pos_multi_unit /path/to/custom/addons/
```

Reiniciar Odoo:

```bash
sudo systemctl restart odoo
```

Actualizar la lista de aplicaciones e instalar:

```text
Ajustes > Aplicaciones > Actualizar lista de apps
Buscar: POS Multi Unit
Instalar
```

## Configuracion

1. Abrir el producto o variante.
2. Ir a la pestana Inventario.
3. En la seccion `Presentaciones POS`, crear o editar las presentaciones.
4. Seleccionar la unidad de medida correspondiente.
5. Activar `Disponible en POS`.
6. Definir `Precio POS`.

El campo `barcode` de `product.uom` es requerido por Odoo 19. El modulo genera uno automaticamente con prefijo `PMU-` cuando no se ingresa manualmente.

## Uso en POS

1. Agregar un producto al carrito.
2. Si el producto tiene presentaciones disponibles en POS, aparece el boton `Cambiar presentacion`.
3. Al hacer clic, aparece un popup con:
   - Unidad base
   - Presentaciones configuradas para POS
4. Al seleccionar una opcion:
   - Unidad base: cantidad 1 y precio original.
   - Presentacion POS: cantidad convertida a unidad base y precio POS configurado.

## Ejemplo

Producto base: Aceite 750ml

| Presentacion | UoM | Disponible en POS | Precio POS |
| --- | --- | --- | --- |
| Six Pack | Paquete x6 | Si | 11.75 |
| Caja | Caja x20 | Si | 38.00 |

Si la unidad `Paquete x6` contiene 6 unidades base, al seleccionarla en POS la linea queda con cantidad 6 y precio unitario 11.75.

## Notas tecnicas

En Odoo 19, el POS carga las presentaciones mediante `product.uom`, no mediante `product.packaging`. Por eso este modulo extiende `product.uom` y usa los factores de conversion de `uom.uom` para calcular la cantidad base.

El boton se integra extendiendo el template `point_of_sale.Orderline` y usando dialogos OWL compatibles con Odoo 19.

## Validacion local realizada

- Sintaxis Python validada.
- XML parseado correctamente.
- Sintaxis JavaScript validada con `node --check`.
