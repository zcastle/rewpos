Ext.define('rewpos.controller.Pagos', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pago', 'Moneda', 'Tarjeta_Credito', 'Descuento_Tipo'],
        models: ['Pago', 'Moneda', 'Tarjeta_Credito', 'Descuento_Tipo'],
        refs: {
            btnPagos: 'pagosView segmentedbutton',
            listPagos: 'pagosView list',
            pagosView: 'pagosView',
            tipoMoneda: 'pagosView selectfield[name=cboTipoPagoMoneda]',
            tipoTarjeta: 'pagosView selectfield[name=cboTipoPagoTarjeta]',
            descuento: 'pagosView selectfield[name=cboDescuento]',
            containerDescuento: 'pagosView container[name=containerDescuento]',
            dniDescuento: 'pagosView textfield[name=dniDescuento]',
            nombreDescuento: 'pagosView textfield[name=nombreDescuento]'
        },
        control: {
            'pagosView': {
                activate: 'onActivate'
            },
            'pagosView button[name=btnCliente]': {
                tap: 'ontapBtnCliente'
            },
            'pagosView button[name=btnLimpiar]': {
                tap: 'ontapBtnLimpiar'
            },
            'pagosView list': {
                itemdoubletap: 'onItemTapPagoList'
            },
            'pagosView numberfield[name=dscto]': {
                action: 'onActionNumberField'
            },
            'pagosView button[name=btnTotalMontoPagarDescuentoDel]': {
                tap: 'onTapDelDscto'
            },
            'pagosView selectfield[name=cboDescuento]': {
                change: 'onChangeCboDescuento'
            }
        } 
    },
    onActivate: function(){
        Ext.getStore('Moneda').load();
        Ext.getStore('Tarjeta_Credito').load();
        Ext.getStore('Descuento_Tipo').load();
        this.getTipoMoneda().setValue(1);
        this.getTipoTarjeta().setValue(1);
        this.getDescuento().setValue(1);
    },
    addPago: function(moneda, tarjetaCredito, tarjetaCreditoName, valorPago) {

        var tipoCambio = moneda==2 ? rewpos.AppGlobals.TIPO_CAMBIO : 0;
        Ext.create('rewpos.model.Pago', {
            nroatencion: Ext.getStore('Pedido').getAt(0).get('nroatencion'),
            moneda_id: moneda,
            tarjeta_credito_id: tarjetaCredito,
            tarjeta_credito_name: tarjetaCreditoName,
            valorpago: valorPago,
            tipocambio: tipoCambio,
            caja_id: rewpos.AppGlobals.CAJA_ID
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
                            this.getPagosView().down('button[name=btnCliente]').setHtml('Cliente');
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
    },
    onActionNumberField: function(txt){
        var value = txt.getValue();
        if(value){
            var moneda = this.getTipoMoneda().getValue();
            var tarjetaCredito = this.getTipoTarjeta().getValue();
            var tarjetaCreditoName = this.getTipoTarjeta().getRecord().get('nombre');

            var recordDescuento = this.getDescuento().getRecord();
            var valorPago = Ext.data.Types.NUMBER.convert(value);

            if(recordDescuento.get("id")==1){
                if(moneda=='DOLARES') valorPago *= rewpos.AppGlobals.TIPO_CAMBIO;
                //if(tipoPago=='OTROS' || !Ext.isNumber(valorPago)) return;
                var existRecord = Ext.getStore('Pago').findRecord('tarjeta_credito_id', tarjetaCredito);
                if (existRecord && existRecord.get("moneda_id")==moneda) {
                    existRecord.set('valorpago', existRecord.get('valorpago')+valorPago);
                    existRecord.save();
                } else {
                    this.addPago(moneda, tarjetaCredito, tarjetaCreditoName, valorPago);
                }
            }else{
                this.getTipoMoneda().setValue(1);
                this.getTipoTarjeta().setValue(1);
                var montoPagar = 0;
                Ext.getStore('Pedido').each(function(item){
                    montoPagar += item.get('cantidad')*item.get('precio');
                });
                var valor_m, valor_p;
                if(recordDescuento.get("tipo")=="M"){
                    valor_m = value;
                    valor_p = (montoPagar*value)/100;
                }else{
                    valor_m = montoPagar*(value/100);
                    valor_p = value;
                }
                var dni, nombre;
                //console.log(this.getDescuento().getRecord().get('datos'));
                if(this.getDescuento().getRecord().get('datos')=='S'){
                    dni = this.getDniDescuento().getValue();
                    nombre = this.getNombreDescuento().getValue();
                    if(dni.trim()=="" || nombre.trim()==""){
                        Ext.Msg.show({
                            title: 'Advertencia',
                            message: 'Debe el Numero de DNI y el NOMBRE del cliente',
                            fn: Ext.emptyFn
                        });
                        return;
                    }
                }
                this.setDescuento(recordDescuento.get("id"), recordDescuento.get("nombre"), montoPagar, valor_m, valor_p, null, dni, nombre);
                this.getDescuento().setValue(1);
            }

            txt.setValue("");
        }else{
            Ext.Msg.show({
                title: 'Advertencia',
                message: 'Debe ingresar un valor numerico',
                fn: Ext.emptyFn
            });
        }
        txt.focus();
    },
    setDescuento: function(id, dscto_name, montoPagar, dscto_m, dscto_p, cb, dni, nombre){
        Ext.getStore('Pedido').each(function(record){
            record.set('descuento_tipo_id', id);
            record.set('dscto_m', dscto_m);
            record.set('dscto_p', dscto_p);
            //
            record.set('dni', dni);
            record.set('nombre', nombre);
            record.save({
                callback: function(){
                    if(dscto_m>0){
                        Ext.getCmp('containerTotalMontoPagarAnt').setHidden(false);
                        Ext.getCmp('containerTotalMontoPagarDescuento').setHidden(false);
                        Ext.getCmp('lblTotalMontoPagarAnt').setHtml(rewpos.Util.toFixed(montoPagar, 2));
                        Ext.getCmp('lblTotalMontoPagarDescuentoTitulo').setHtml(dscto_name+" "+dscto_p+"%");
                        Ext.getCmp('lblTotalMontoPagarDescuento').setHtml(rewpos.Util.toFixed(dscto_m, 2));
                    }else{
                        Ext.getCmp('containerTotalMontoPagarAnt').setHidden(true);
                        Ext.getCmp('containerTotalMontoPagarDescuento').setHidden(true);
                    }
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion+'/'+rewpos.AppGlobals.CAJA_ID
                    });
                    if(cb){
                        cb();
                    }
                }
            });
        });
    },
    onTapDelDscto: function(){
        Ext.Msg.show({
            title: "Confirmacion", 
            message: "Desea eliminar el descuento?",
            buttons:  [{
                itemId: 'no',
                text: 'No'
            },{
                itemId: 'yes',
                text: 'Si'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    this.setDescuento(0, "", 0, 0, 0, null, 0, null);
                }
            },
            scope: this
        });
    },
    onChangeCboDescuento: function(cbo, newValue, oldValue){
        if(cbo.getRecord().get('datos')=='S'){
            this.getDniDescuento().setValue("");
            this.getNombreDescuento().setValue("");
            this.getContainerDescuento().setHidden(false);
        }else{
            this.getContainerDescuento().setHidden(true);
        }
    }
});