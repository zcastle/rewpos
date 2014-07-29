Ext.define('rewpos.controller.Pagos', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pago'],
        models: ['Pago'],
        refs: {
            btnPagos: 'pagosView segmentedbutton',
            listPagos: 'pagosView list'
        },
        control: {
            'pagosView button[name=valorPago]': {
                tap: 'ontapValorPago'
            },
            'pagosView segmentedbutton': {
                toggle: 'onToggleTipoPago'
            },
            'pagosView button[name=btnCliente]': {
                tap: 'ontapBtnCliente'
            },
            'pagosView list': {
                itemdoubletap: 'onItemTapPagoList'
            }
        } 
    },
    onToggleTipoPago: function(container, btn, pressed){
        if(pressed) {
            if(btn.getText()=='PROPINA' || btn.getText()=='OTROS') return;
            var existe = false;
            var cuenta = 0.0;
            var pagado = 0.0;
            Ext.getStore('Pago').each(function(record, index, length){
                pagado += record.get('valorpago');
                if(record.get('tipopago')==btn.getText()) {
                    existe = true;
                }
            }, this)
            if(!existe){
                Ext.getStore('Pedido').each(function(record, index, length){
                    cuenta += record.get('precio')*record.get('cantidad');
                }, this)
                var saldo = cuenta - pagado;
                if(saldo>0) {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    var tipoPago = btn.getText();
                    var orden = btn.orden;
                    var valorPago = saldo;
                    var tipoCambio = tipoPago=='DOLARES' ? rewpos.AppGlobals.TIPO_CAMBIO : '';
                    Ext.create('rewpos.model.Pago', {
                        nroatencion: nroatencion,
                        tipopago: tipoPago,
                        valorpago: valorPago,
                        tipocambio: tipoCambio,
                        orden: orden
                    }).save({
                        success: function(record) {
                            Ext.getStore('Pago').add(record);
                        },
                        scope: this
                    });
                }
            }
        }
    },
    ontapValorPago: function(btn) {
        var tipoPago = this.getBtnPagos().getPressedButtons()[0].getText();
        var orden = this.getBtnPagos().getPressedButtons()[0].orden;
        var valorPago = Ext.data.Types.NUMBER.convert(btn.getText());
        if(tipoPago=='DOLARES') valorPago *= rewpos.AppGlobals.TIPO_CAMBIO;
        if(tipoPago=='OTROS' || !Ext.isNumber(valorPago)) return;
        //if(!Ext.isNumber(valorPago)) return;
        var existRecord = Ext.getStore('Pago').findRecord('tipopago', tipoPago);
        if (existRecord) {
            existRecord.set('valorpago', existRecord.get('valorpago')+valorPago);
            existRecord.save();
        } else {
            var tipoCambio = tipoPago=='DOLARES' ? rewpos.AppGlobals.TIPO_CAMBIO : '';
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            Ext.create('rewpos.model.Pago', {
                nroatencion: nroatencion,
                tipopago: tipoPago,
                valorpago: valorPago,
                tipocambio: tipoCambio,
                orden: orden
            }).save({
                success: function(record) {
                    Ext.getStore('Pago').add(record);
                },
                scope: this
            });
        }
    },
    ontapBtnCliente: function() {
        Ext.Viewport.add({xtype: 'clienteModal', scrollable: false});
    },
    onItemTapPagoList: function(item, index, target, record) {
        var mensaje = 'Desea eliminar el pago con '+record.get('tipopago');
        if(record.get('tipopago')=='PROPINA') mensaje = 'Desea eliminar la PROPINA';
        Ext.Msg.show({
            title: "Confirmacion", 
            message: mensaje,
            buttons:  [{
                itemId: 'no',
                text: 'No'
            },{
                itemId: 'yes',
                text: 'Si'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    record.erase({
                        success: function() {
                            Ext.getStore('Pago').remove(record);
                        }
                    });
                }
            },
            scope: this
        });
    }
});