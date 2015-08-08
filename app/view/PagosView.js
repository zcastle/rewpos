Ext.define('rewpos.view.PagosView', {
	extend: 'Ext.Container',
    xtype: 'pagosView',
    config: {
    	layout: 'hbox',
        defaults: {
            xtype: 'container'
        },
        items: [{
            flex: 1,
            layout: 'vbox',
            /*defaults: {
                xtype: 'button'
            },*/
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
                //xtype: 'container',
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
                    name: 'lblTotalMontoPagar',
                    html: '0.00'
                }]
            },{
                xtype: 'list',
                store: 'Pago',
                //disableSelection: true,
                flex: 1,
                itemTpl: new Ext.XTemplate(
                    '<tpl if="this.isPropina(tipopago)">',
                        '<div class="-row-list propina">',
                    '<tpl else>',
                        '<div class="-row-list">',
                    '</tpl>',
                        '{tipopago}&nbsp;',
                        '<div class="field estilo-dolar">{tipocambio:this.complete}</div>',
                        '<div class="field flex">{[this.getDolar(values.valorpago, values.tipopago)]}</div>',
                        '{valorpago:this.formatNumer}',
                    '</div>',
                    {
                        complete: function(item) {
                            return item==null ? '' : '(TC.'+item+')';
                        },
                        formatNumer: function(item) {
                            return rewpos.Util.toFixed(item, 2);
                        },
                        isPropina: function(tipopago){
                           return tipopago == 'PROPINA';
                        },
                        getDolar: function(valorpago, tipopago) {
                            return tipopago == 'DOLARES' ? rewpos.Util.toFixed(valorpago/rewpos.AppGlobals.TIPO_CAMBIO, 2) : '';
                        }
                    }
                )
            },{
                //xtype: 'container',
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
                //xtype: 'container',
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
                //xtype: 'container',
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
            width: 5
        },{
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            flex: 1,
            layout: 'vbox',
            items: [{
                layout: 'hbox',
                cls: 'tipoPago',
                xtype: 'segmentedbutton',
                defaults: {
                    width: '50%'
                },
                items: [{
                    text: 'SOLES',
                    orden: '1',
                    pressed: true
                },{
                    text: 'DOLARES',
                    orden: '2'
                },{
                    text: 'VISA',
                    orden: '3'
                },{
                    text: 'MASTER',
                    orden: '4'
                },{
                    text: 'DINERS',
                    orden: '5'
                },{
                    text: 'AMEX',
                    orden: '6'
                },{
                    text: 'PROPINA',
                    orden: '7'
                },{
                    text: 'OTROS'
                }]
            },{
                height: 5
            },{
                layout: 'hbox',
                cls: 'valoresPago',
                defaults: {
                    xtype: 'button',
                    width: '50%',
                    name: 'valorPago'
                },
                items: [{
                    text: '0.10'
                },{
                    text: '0.20'
                },{
                    text: '0.50'
                },{
                    text: '1.00'
                },{
                    text: '2.00'
                },{
                    text: '5.00'
                },{
                    text: '10.00'
                },{
                    text: '20.00'
                },{
                    text: '50.00'
                },{
                    text: '100.00'
                },{
                    text: '200.00'
                },{
                    text: 'DIGITAR'
                }]
            }]
        }]
    }
});