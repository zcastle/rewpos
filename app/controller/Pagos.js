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
            'pagosView list': {
                itemtap: 'onItemTapPagoList'
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
                    //newRecord.set('id', record.get('id'));
                    Ext.getStore('Pago').add(record);
                },
                scope: this
            });
        }
    },
    onItemTapPagoList: function(item, index, target, record) {
        var mensaje = 'Desea eliminar el pago con '+record.get('tipopago');
        if(record.get('tipopago')=='PROPINA') mensaje = 'Desea eliminar la PROPINA';
        Ext.Msg.show({
            //title: "Confirmacion", 
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