Ext.define('rewpos.controller.Pagos', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pago'],
        models: ['Pago'],
        refs: {
            btnPagos: 'pagosView segmentedbutton',
            listPagos: 'pagosView list',
            pagosView: 'pagosView'
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
            'pagosView button[name=btnLimpiar]': {
                tap: 'ontapBtnLimpiar'
            },
            'pagosView list': {
                itemdoubletap: 'onItemTapPagoList'
            }
        } 
    },
    onToggleTipoPago: function(container, btn, pressed){
        if(pressed) {
            if(btn.getText()=='SOLES' || btn.getText()=='DOLARES' || btn.getText()=='PROPINA' || btn.getText()=='OTROS') return;
            if(btn.getText()=='OTROS') {
                
            } else {
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
                        var tipoPago = btn.getText();
                        var orden = btn.orden;
                        var valorPago = saldo;
                        this.addPago(tipoPago, valorPago, orden);
                    }
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
            this.addPago(tipoPago, valorPago, orden);
        }
    },
    addPago: function( tipoPago, valorPago, orden) {
        var tipoCambio = tipoPago=='DOLARES' ? rewpos.AppGlobals.TIPO_CAMBIO : '';
        Ext.create('rewpos.model.Pago', {
            nroatencion: Ext.getStore('Pedido').getAt(0).get('nroatencion'),
            tipopago: tipoPago,
            caja_id: rewpos.AppGlobals.CAJA_ID,
            valorpago: valorPago,
            tipocambio: tipoCambio,
            orden: orden
        }).save({
            success: function(record) {
                Ext.getStore('Pago').add(record);
            },
            scope: this
        });
    },
    ontapBtnCliente: function() {
        var clienteId = Ext.getStore('Pedido').getAt(0).get('cliente_id');
        if(clienteId>0) {
            Ext.Viewport.add({xtype: 'clienteModal', scrollable: false});
        } else {
            Ext.Viewport.add({xtype: 'clienteBuscarModal', scrollable: false});
        }
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
    },
    ontapBtnLimpiar: function() {
        Ext.Msg.show({
            title: "Confirmacion", 
            message: "Desea eliminar el cliente?",
            buttons:  [{
                itemId: 'no',
                text: 'No'
            },{
                itemId: 'yes',
                text: 'Si'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    Ext.Ajax.request({
                        url: rewpos.AppGlobals.HOST+'pedido/actualizar/cliente',
                        method: 'POST',
                        params: {
                            nroatencion: nroatencion,
                            clienteId: 0
                        },
                        callback: function(){
                            rewpos.Util.unmask();
                            this.getPagosView().down('button[name=btnCliente]').setText('Cliente');
                            Ext.getStore('Pedido').each(function(pedido){
                                pedido.set('cliente_id', 0);
                                pedido.set('cliente_name', 'Cliente');
                            });
                        },
                        scope: this
                    });
                }
            },
            scope: this
        });
        
    }
});