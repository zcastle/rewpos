Ext.define('rewpos.controller.Comando', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Imprimir'],
        refs: {
            productoList: 'productoList'
        },
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
                    //rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                    rewpos.Util.showPanel('comandoCard', 'categoriaDataView', 'left');
                } else {
                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                }
                //console.log(Ext.getCmp('productosCard').getActiveItem().getId());
                if(Ext.getCmp('productosCard').getActiveItem().getId()=='productoList') {
                    rewpos.AppGlobals.LIST_SELECTED = this.getProductoList();
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
            //console.log(rewpos.AppGlobals.HOST_PRINT+'precuenta/'+cajaId+'/'+nroAtencion);
            //Ext.Ajax.setDisableCaching(false);
            //Ext.Ajax.setUseDefaultXhrHeader(false);
            Ext.ModelManager.getModel('rewpos.model.Imprimir').load("precuenta/"+cajaId+"/"+nroAtencion,{
                callback: function(record, operation) {
                    rewpos.Util.unmask();
                },
                scope: this
            });
            /*Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST_PRINT+'precuenta/'+cajaId+'/'+nroAtencion,
                disableCaching: false,
                useDefaultXhrHeader: false,
                callback: function(request, success, response){
                    rewpos.Util.unmask();
                    if(success){
                        var text = Ext.JSON.decode(response.responseText);
                        if(!text.success) {
                            Ext.Msg.alert('Advertencia', rewpos.AppGlobals.MSG_PRINTER_ERROR, Ext.emptyFn);
                        }
                    } else {
                        Ext.Msg.alert('Advertencia', rewpos.AppGlobals.MSG_PRINTER_ERROR, Ext.emptyFn);
                    }
                }
            });*/
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
        Ext.ModelManager.getModel('rewpos.model.Imprimir').load("pedido/"+cajaId+"/"+nroAtencion,{
            callback: function(record, operation) {
                rewpos.Util.unmask();
                Ext.getStore('Pedido').each(function(item){
                    item.set('enviado', "S");
                });
            },
            scope: this
        });
        /*Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST_PRINT+'pedido/'+cajaId+'/'+nroAtencion,
            disableCaching: false,
            useDefaultXhrHeader: false,
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
        });*/
    }
});