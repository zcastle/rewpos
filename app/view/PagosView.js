Ext.define('rewpos.view.PagosView', {
	extend: 'Ext.Container',
    xtype: 'pagosView',
    config: {
    	layout: 'vbox',
        defaults: {
            xtype: 'container'
        },
        items: [{
            layout: 'hbox',
            items: [{
                xtype: 'button',
                name: 'btnCliente',
                text: 'Cliente',
                cls: 'button-label-align-left',
                flex: 1
            },{
                xtype: 'button',
                name: 'btnLimpiar',
                text: 'X',
                cls: 'button-label-limpiar'
            }]
        },{
            layout: 'hbox',
            defaults: {
                xtype: 'container'
            },
            flex: 1,
            items:[{
                flex: 1,
                layout: 'vbox',
                /*defaults: {
                    xtype: 'button'
                },*/
                items: [{
                    layout: 'vbox',
                    items: [{
                        id: 'containerTotalMontoPagarAnt',
                        layout: 'hbox',
                        cls: 'label',
                        //hidden: true,
                        items: [{
                            xtype: 'label',
                            html: 'Cuenta',
                            flex: 1
                        },{
                            xtype: 'label',
                            html: rewpos.AppGlobals.MONEDA_SIMBOLO
                        },{
                            xtype: 'label',
                            id: 'lblTotalMontoPagarAnt',
                            html: '0.00'
                        }]
                    },{
                        id: 'containerTotalMontoPagarDescuento',
                        layout: 'hbox',
                        //hidden: true,
                        items: [{
                            layout: 'hbox',
                            cls: 'label',
                            flex: 1,
                            items: [{
                                xtype: 'label',
                                id: 'lblTotalMontoPagarDescuentoTitulo',
                                html: 'Cuenta',
                                flex: 1
                            },{
                                xtype: 'label',
                                html: rewpos.AppGlobals.MONEDA_SIMBOLO
                            },{
                                xtype: 'label',
                                id: 'lblTotalMontoPagarDescuento',
                                html: '0.00'
                            }]
                        },{
                            xtype: 'button',
                            cls: 'button-label-limpiar-dscto',
                            name: 'btnTotalMontoPagarDescuentoDel',
                            text: 'X'
                        }]
                    },{
                        layout: 'hbox',
                        cls: 'label',
                        items: [{
                            xtype: 'label',
                            html: 'Cuenta',
                            flex: 1
                        },{
                            xtype: 'label',
                            html: rewpos.AppGlobals.MONEDA_SIMBOLO
                        },{
                            xtype: 'label',
                            id: 'lblTotalMontoPagar',
                            name: 'lblTotalMontoPagar',
                            html: '0.00'
                        }]
                    }]
                },{
                    xtype: 'list',
                    store: 'Pago',
                    //disableSelection: true,
                    flex: 1,
                    itemTpl: new Ext.XTemplate(
                        '<tpl if="this.isPropina(tarjeta_credito_name)">',
                            '<div class="-row-list propina">',
                        '<tpl else>',
                            '<div class="-row-list">',
                        '</tpl>',
                            '{tarjeta_credito_name}&nbsp;',
                            '<div class="field estilo-dolar">{[this.getDolar(values.valorpago, values.moneda_id)]}</div>',
                            '<div class="field flex">{tipocambio:this.complete}</div>',
                            '{[this.getIfDolar(values.valorpago, values.moneda_id)]}',
                        '</div>',
                        {
                            complete: function(item) {
                                return item==null || item==0 ? '' : '*TC-'+item+'';
                            },
                            formatNumer: function(item) {
                                return rewpos.Util.toFixed(item, 2);
                            },
                            isPropina: function(tipopago){
                               return tipopago == 'PROPINA';
                            },
                            getDolar: function(valorpago, moneda_id) {
                                //return moneda_id == 2 ? rewpos.Util.toFixed(valorpago/rewpos.AppGlobals.TIPO_CAMBIO, 2) : '';
                                return moneda_id == 2 ? rewpos.Util.toFixed(valorpago, 2) : '';
                            },
                            getIfDolar: function(valorpago, moneda_id) {
                                return moneda_id == 2 ? rewpos.Util.toFixed(valorpago*rewpos.AppGlobals.TIPO_CAMBIO, 2) : rewpos.Util.toFixed(valorpago, 2);
                            }
                        }
                    )
                },{
                    layout: 'hbox',
                    cls: 'label label-fin',
                    items: [{
                        xtype: 'label',
                        html: 'Ingresado',
                        flex: 1
                    },{
                        xtype: 'label',
                        html: rewpos.AppGlobals.MONEDA_SIMBOLO
                    },{
                        xtype: 'label',
                        id: 'lblTotalMontoIngresado',
                        html: '0.00'
                    }]
                },{
                    layout: 'hbox',
                    cls: 'label label-fin',
                    items: [{
                        xtype: 'label',
                        html: 'Por Pagar',
                        flex: 1
                    },{
                        xtype: 'label',
                        html: rewpos.AppGlobals.MONEDA_SIMBOLO
                    },{
                        xtype: 'label',
                        id: 'lblTotalMontoRestante',
                        html: '0.00'
                    }]
                },{
                    id: 'containerTotalMontoVuelto',
                    layout: 'hbox',
                    cls: 'label label-fin',
                    hidden: true,
                    items: [{
                        xtype: 'label',
                        html: 'Vuelto',
                        flex: 1
                    },{
                        xtype: 'label',
                        html: rewpos.AppGlobals.MONEDA_SIMBOLO
                    },{
                        xtype: 'label',
                        id: 'lblTotalMontoVuelto',
                        html: '0.00'
                    }]
                }]
            },{
                width: 3
            },{
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                flex: 1,
                layout: 'vbox',
                items: [{
                    xtype: 'selectfield',
                    name: 'cboTipoPagoMoneda',
                    baseCls: 'btn_seleccion',
                    store: 'Moneda',
                    valueField : 'id',
                    displayField : 'nombre'
                },{
                    xtype: 'selectfield',
                    name: 'cboTipoPagoTarjeta',
                    baseCls: 'btn_seleccion',
                    store: 'Tarjeta_Credito',
                    valueField : 'id',
                    displayField : 'nombre'
                },{
                    xtype: 'selectfield',
                    name: 'cboDescuento',
                    baseCls: 'btn_seleccion',
                    store: 'Descuento_Tipo',
                    valueField : 'id',
                    displayField : 'nombre_largo'
                },{
                    height: 3
                },{
                    xtype: 'numberfield',
                    minValue: 0
                }/*,{
                    height: 3
                },{
                    xtype: 'tecladoMonedaMini'
                }*/]
            }]
        }]
    }
});