Ext.define('rewpos.controller.Comando', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        control: {
            'comandosView button': {
                tap: 'ontap'
            }
        } 
    },
    ontap: function(btn) {
        switch(btn.getItemId()) {
            case 'btnComandoBuscar':
                if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                    rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                } else {
                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                }
                break;
            case 'btnComandoPrecuenta':
                this.precuenta();
                break;
            case 'btnComandoEnviar':
                this.enviarPedido();
                break;
            case 'btnComandoMas':
                Ext.Viewport.toggleMenu('right');
                break;
        }
    },
    precuenta: function() {
        if(rewpos.AppGlobals.DEBUG) {
            Ext.Msg.alert('Advertencia', 'No se puede enviar PRECUENTA en modo DEBUG', Ext.emptyFn);
            return;
        }
        //rewpos.Print.precuenta('');
        //return;
        if(Ext.getStore('Pedido').getCount()>0){
            var cajaId = Ext.getStore('Pedido').getAt(0).get('caja_id');
            var nroAtencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/precuenta/'+cajaId+'/'+nroAtencion,
                callback: function(){
                }
            });
            rewpos.Util.mask();
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST_PRINT+'print/precuenta/'+cajaId+'/'+nroAtencion,
                //method: 'GET',
                callback: function(request, success, response){
                    rewpos.Util.unmask();
                    if(success){
                        var text = Ext.JSON.decode(response.responseText);
                        if(!text.success) {
                            Ext.Msg.alert('Advertencia', rewpos.AppGlobals.MSG_PRINTER_ERROR, Ext.emptyFn);
                        } else {
                            //cajaId
                            //nroAtencion
                            /*Ext.Ajax.request({
                                url: rewpos.AppGlobals.HOST+'pedido/precuenta/'+cajaId+'/'+nroAtencion,
                                callback: function(){
                                }
                            });*/
                        }
                    } else {
                        Ext.Msg.alert('Advertencia', rewpos.AppGlobals.MSG_PRINTER_ERROR, Ext.emptyFn);
                    }
                }
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido', Ext.emptyFn);
        }
    },
    enviarPedido: function() {
        if(Ext.getStore('Pedido').getCount()>0){
            var noEnviados = Ext.getStore('Pedido').findExact('enviado', 'N');
            if(noEnviados < 0) {
                Ext.Msg.alert('', 'Todos los productos han sido enviados', Ext.emptyFn);
                return;
            }
            Ext.Msg.show({
                title: "Confirmacion", 
                message: "Desea enviar los producto?",
                buttons:  [{
                    itemId: 'no',
                    text: 'No'
                },{
                    itemId: 'yes',
                    text: 'Si'
                }],
                fn: function(btn) {
                    if(btn=='yes'){
                        this.enviarPedidoOk();
                    }
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido', Ext.emptyFn);
        }
    },
    enviarPedidoOk: function() {
        var cajaId = Ext.getStore('Pedido').getAt(0).get('caja_id');
        var nroAtencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
        rewpos.Util.mask();
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST_PRINT+'print/pedido/'+cajaId+'/'+nroAtencion,
            callback: function(request, success, response){
                rewpos.Util.unmask();
                if(success){
                    var text = Ext.JSON.decode(response.responseText);
                    if(!text.success) {
                        Ext.Msg.alert('Advertencia', 'Error al ENVIAR PEDIDO', Ext.emptyFn);
                    } else {
                        Ext.getStore('Pedido').each(function(item){
                            item.set('enviado', "S");
                        });
                    }
                } else {
                    Ext.Msg.alert('Advertencia', 'Error al ENVIAR PEDIDO', Ext.emptyFn);
                }
            }
        });
    }
});