Ext.define('rewpos.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario'],
        models: ['Usuario', 'Corporacion', 'Caja'],
        refs: {
            seleccionView: 'seleccionView'
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
        //Ext.getStore('Producto').load();
        Ext.Msg.defaultAllowedConfig.showAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.Msg.defaultAllowedConfig.hideAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.ModelManager.getModel('rewpos.model.Corporacion').load('',{
            success: function(corporacion) {
                rewpos.AppGlobals.CORPORACION = corporacion.get('nombre');
                Ext.getCmp('empresaLogin').setText(rewpos.AppGlobals.CORPORACION);
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
                            text: item.get('nombre')+' '+item.get('apellido'),
                            value: item.get('id')
                        })
                    }
                }, this);
                this.getSeleccionView().down('selectfield[name=cboMozos]').setOptions(options);
            },
            scope: this
        });
        //PAX
        var options = new Array();
        for (var i = 1; i <= 50; i++) {
            options.push({
                text: 'PAX: '+i,
                value: i
            });
        };
        this.getSeleccionView().down('selectfield[name=cboPax]').setOptions(options);
        //
        var menu = Ext.create('Ext.Menu', {
            id: 'menupos',
            items: [{
                text: 'Cambiar Mesa'
            },{
                text: 'Unir Mesas'
            },{
                text: 'Liberar Mesa',
                handler: rewpos.app.getController('Pedido').liberar
            },{
                text: 'Resumen Diario'
            },{
                text: 'Pagar',
                handler: rewpos.app.getController('Pedido').pagar
            },{
                text: '' //Configuracion
            },{
                text: 'Cerrar Sesion',
                handler: function(){
                    Ext.Viewport.toggleMenu('right');
                    Ext.Msg.show({
                        title: "Confirmacion",
                        message: "Desea cerrar su sesion?",
                        buttons:  [{
                            itemId: 'no',
                            text: 'No'
                        },{
                            itemId: 'yes',
                            text: 'Si'
                        }],
                        fn: function(btn) {
                            if(btn=='yes'){
                                Ext.getCmp('empresaLogin').setText(rewpos.AppGlobals.CORPORACION);
                                Ext.getCmp('usuarioLogin').setText('');
                                rewpos.Util.showPanel('mainCard', 'accesoView', 'right');
                            }
                        },
                        scope: this
                    });
                }
            }]
        });
        Ext.Viewport.setMenu(menu, {
            side: 'right',
            reveal: false,
            cover: false
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
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
        }
    }
});