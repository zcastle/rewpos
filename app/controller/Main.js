Ext.define('rewpos.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario', 'Pedido', 'Pago'],
        models: ['Usuario', 'Corporacion', 'Caja'],
        refs: {
            seleccion: 'seleccion'
        },
        control: {
            'main': {
                activate: 'activate'
            }
        } 
    },
    activate: function() {
        //alert('activate');
        console.log('Sistema iniciado');
        console.log('Debug is '+rewpos.AppGlobals.DEBUG);
        Ext.Msg.defaultAllowedConfig.showAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.Msg.defaultAllowedConfig.hideAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.ModelManager.getModel('rewpos.model.Corporacion').load('',{
            success: function(corporacion) {
                Ext.getCmp('empresaLogin').setText(corporacion.get('nombre'));
                this.loadDefault();
            },
            scope: this
        });
        Ext.getStore('Usuario').load({
            callback: function(records, operation, success) {
                var options = new Array();
                options.push({
                    text: 'Elegir Mozo',
                    value: 0
                });
                Ext.Array.forEach(records, function(item) {
                    if (item.get('rol_id')==rewpos.AppGlobals.ROL_ID_MOZO) {
                        options.push({
                            text: item.get('usuario'),
                            value: item.get('id')
                        })
                    }
                }, this);
                this.getSeleccion().down('selectfield[name=cboMozos]').setOptions(options);
            },
            scope: this
        });
        var menu = Ext.create('Ext.Menu', {
            id: 'menupos',
            items: [{
                text: 'Cambiar Mesa'
            },{
                text: 'Unir Mesas'
            },{
                text: 'Liberar Mesa'
            },{
                text: 'Resumen Diario'
            },{
                text: 'Pagar',
                handler: this.pagar
            },{
                text: 'Configuracion'
            },{
                text: 'Cerrar Sesion'
            }]
        });
        Ext.Viewport.setMenu(menu, {
            side: 'right',
            reveal: true
        });
    },
    loadDefault: function() {
        if (rewpos.AppGlobals.DEBUG) {
            rewpos.AppGlobals.USUARIO = Ext.create('rewpos.model.Usuario', {
                id: 99,
                nombre: 'Administrador',
                apellido: '',
                usuario: 'root',
                ubigeo_id: 1394,
                centrocosto_id: 1,
                rol_id: 1
            });
            rewpos.AppGlobals.CAJA = Ext.create('rewpos.model.Caja', {
                id: 98,
                nombre: 'Administrador',
                impresora_p: 'PRECUENTA',
                impresora_b: 'PRECUENTA',
                impresora_f: 'PRECUENTA',
                centrocosto_name: 'ANGAMOS',
                empresa_name: 'DOGIA'
            });
            Ext.getCmp('empresaLogin').setText(rewpos.AppGlobals.CAJA.get('empresa_name')+' - '+rewpos.AppGlobals.CAJA.get('centrocosto_name'));
            Ext.getCmp('usuarioLogin').setText(rewpos.AppGlobals.USUARIO.get('nombre'));
            if(rewpos.AppGlobals.ANIMACION) {
                Ext.getCmp('mainCard').animateActiveItem('pedidoView', {
                        type: 'slide',
                        direction: 'left'
                    }
                );
            } else {
                Ext.getCmp('mainCard').setActiveItem('pedidoView');
            }
        }
    },
    pagar: function() {
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mensaje = 'Pagar cuenta';
            if(Ext.getStore('Pago').getCount()==0){
                mensaje = 'La cuenta se pagara con el monto exacto, desea continuar?';
            }
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
                        Ext.Viewport.setMasked(true);
                        Ext.Ajax.request({
                            url: rewpos.AppGlobals.HOST+'pedido/pagar',
                            method: 'POST',
                            params: {
                                nroatencion: nroatencion
                            },
                            callback: function(request, success, response){
                                var text = Ext.JSON.decode(response.responseText);
                                if(text.success){
                                    Ext.getStore('Pago').removeAll();
                                    Ext.getStore('Pedido').removeAll();
                                    Ext.getCmp('lblTotalItems').setHtml('TOTAL ITEMS: 0');
                                    Ext.getCmp('lblTotalMonto').setText('S/. 0.00');
                                }
                                Ext.Viewport.setMasked(false);
                            }
                        });
                    }
                    Ext.Viewport.toggleMenu('right');
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido para procesar', function(){
                Ext.Viewport.toggleMenu('right');   
            });
        }
    }
});