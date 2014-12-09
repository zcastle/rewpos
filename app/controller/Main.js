Ext.define('rewpos.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Cajero', 'Mozo', 'Admin', 'Pago', 'Pedido'],
        models: ['Usuario', 'Caja', 'Config'],
        refs: {
            seleccionView: 'seleccionView',
            pedidoList: 'pedidoList',
            pedidoView: 'pedidoView',
            productoList: 'productoList',
            toolbarView: 'toolbarView',
            accesoView: 'accesoView'
        },
        control: {
            'main': {
                initialize: 'initialize',
                activate: 'activate'
            }
        } 
    },
    initialize: function(){
        rewpos.Util.log('POS Initialize');
        /*Ext.Viewport.on('orientationchange', function() {
            Ext.Viewport.remove('pedidoView', true);
            if(Ext.Viewport.getOrientation()=='portrait'){ //Vertical
                this.getPedidoView().setLayout('hbox');
                //this.getPedidoView().removeCls('x-horizontal');
                //this.getPedidoView().addCls('x-vertical');
            } else {
                this.getPedidoView().setLayout('vbox');
                //this.getPedidoView().removeCls('x-vertical');
                //this.getPedidoView().addCls('x-horizontal');
            }
            this.getPedidoView().doLayout()
            Ext.Viewport.add('pedidoView');
        });*/
        
        Ext.ModelManager.getModel('rewpos.model.Config').load(1,{
            callback: function(record, operation) {
                if(record) {
                    rewpos.AppGlobals.CAJA_ID = record.get('caja_id');
                    rewpos.AppGlobals.HOST_PRINT = 'http://'+record.get('print_server')+':'+record.get('print_port')+'/';
                    //this.loadCaja();
                } else {
                    if(rewpos.AppGlobals.DEV){
                        Ext.create('rewpos.model.Config', {
                            id: 1,
                            caja_id: 2,
                            print_server: 'localhost',
                            print_port: '8523'
                        }).save({
                            callback: function(){
                                window.location.reload();
                            }
                        });
                    }else {
                        this.getApplication().getController('Acceso').configuracion();
                    }
                }
            },
            scope: this
        });
    },
    activate: function() {
        rewpos.Util.log('POS Activate');
        rewpos.Util.log('Debug is '+rewpos.AppGlobals.DEBUG);
        this.loadCaja();
        /*Ext.Ajax.request({
            url: 'http://localhost:3000/api/tvshows',
            method: 'GET',
            callback: function(res, success, req){
                rewpos.Util.log('OK');
                rewpos.Util.log(res);
                rewpos.Util.log(success);
                rewpos.Util.log(req);
                rewpos.Util.log(req.responseText);
            }
        });*/
    },
    loadCaja: function() {
        if(rewpos.AppGlobals.CAJA_ID==null) return;
        Ext.ModelManager.getModel('rewpos.model.Caja').load(rewpos.AppGlobals.CAJA_ID,{
            callback: function(caja) {
                if(caja) {
                    rewpos.AppGlobals.CAJA = caja;
                    this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CAJA.get('empresa_name')+' - '+rewpos.AppGlobals.CAJA.get('centrocosto_name'));
                    this.activateOk();
                } else {
                    Ext.Msg.alert('Advertencia', 'No se puede hallar la caja con el id: '+rewpos.AppGlobals.CAJA_ID, Ext.emptyFn);
                }
            },
            scope: this
        });
    },
    activateOk: function() {
        Ext.getStore('Mesa').load({url: rewpos.AppGlobals.HOST+'mesa/'+rewpos.AppGlobals.CAJA_ID});
        Ext.getStore('Pedido').addListener({
            load: this.setHeader,
            addrecords: this.setHeader,
            updaterecord: this.setHeader,
            removerecords: this.setHeader,
            scope: this
        });

        /* Scroll con mouse */
        $('.x-scroll-view').mousewheel(function(event) {
            event.preventDefault();
            var scrollTop = this.scrollTop;
            this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
        });
        /**/

        function selectList(list, index) {
            list.select(index);
            var record = list.getSelection()[0];
            list.scrollToRecord(record);
        }
        if(Ext.os.deviceType=='Desktop') {
            $(document.body).keydown(function(event) {
                var list = rewpos.AppGlobals.LIST_SELECTED; //rewpos.app.getController('Main').getPedidoList();
                if(list==null) return;
                var store = rewpos.AppGlobals.LIST_SELECTED.getStore();
                if(store==null) return;
                var record = list.getSelection()[0];
                var totalIndex = store.getCount()-1;
                if(record) {
                    var index = store.findExact('id', record.get('id'));
                    if(event.which==38) { //KEY UP
                        if(index>0) {
                            selectList(list, index-1);
                        }
                    } else if(event.which==40) { //KEY DOWN
                        if(index<totalIndex) {
                            selectList(list, index+1);
                        }
                    } else if(event.which==13) { //KEY ENTER
                        var record = list.getSelection()[0];
                        switch(list.getId()) {
                            case 'pedidoList':
                                break;
                            case 'categoriaList':
                                break;
                            case 'productoList':
                                rewpos.app.getController('Producto').onItemDoubleTapProductoList(null, null, null, record);
                                break;
                            case 'clientesList':
                                rewpos.app.getController('ClienteModal').onItemDoubleTapClienteList(list, null, null, record);
                                break;
                        }
                    } else if(event.which==37) { //KEY LEFT
                        //if(list.getId()=='categoriaList') {
                        //    rewpos.app.getController('Main').getProductoList().select(0);
                        //}
                    }
                }
            });
        }

        /*$(document.body).keydown(function(event) {
            if(event.which==119) { //F8 PRECUENTA ESPECIAL
            } else if(event.which==120) { //F9 PAGAR
                //rewpos.app.getController('Pedido').pagar();
            }
        });*/

        Ext.Msg.defaultAllowedConfig.showAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.Msg.defaultAllowedConfig.hideAnimation = rewpos.AppGlobals.ANIMACION;

        Ext.getStore('Cajero').load({
            url: rewpos.AppGlobals.HOST+'usuario/pos/rol/'+rewpos.AppGlobals.ROL_ID_VENTA,
            callback: function(records, operation, success) {
                if(rewpos.AppGlobals.CAJA.get('tipo')=='C') {
                    this.getAccesoView().down('dataview').setStore('Cajero');
                }
            },
            scope: this
        });
        Ext.getStore('Mozo').load({
            url: rewpos.AppGlobals.HOST+'usuario/pos/rol/'+rewpos.AppGlobals.ROL_ID_MOZO,
            callback: function(records, operation, success) {
                if(rewpos.AppGlobals.CAJA.get('tipo')=='P') { 
                    this.getAccesoView().down('dataview').setStore('Mozo');
                }
                if(rewpos.AppGlobals.CAJA.get('tipo')=='C') {
                    var mozos = new Array();
                    mozos.push({
                        text: 'Elegir Mozo',
                        value: 0
                    });
                    Ext.Array.forEach(records, function(item) {
                        if (item.get('rol_id')==rewpos.AppGlobals.ROL_ID_MOZO) {
                            mozos.push({
                                value: item.get('id'),
                                text: item.get('nombre')+' '+item.get('apellido')
                            })
                        }
                    }, this);
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setOptions(mozos);
                }
            },
            scope: this
        });
        Ext.getStore('Admin').load({
            url: rewpos.AppGlobals.HOST+'usuario/pos/rol/'+rewpos.AppGlobals.ROL_ID_ADMIN,
            callback: function(records, operation, success) {
            }
        });
        //PAX
        var pax = new Array();
        for (var i = 1; i <= 50; i++) {
            pax.push({
                text: 'PAX: '+i,
                value: i
            });
        };
        this.getSeleccionView().down('selectfield[name=cboPax]').setOptions(pax);
        //
        rewpos.Menu.CAJA = Ext.create('Ext.Menu', {
            cls: 'menupos',
            items: [{
                text: 'Cambiar Mesa',
                scope: this.getApplication().getController('Pedido'),
                handler: this.getApplication().getController('Pedido').cambiar
            },{
                text: 'Unir Mesas',
                scope: this,
                handler: this.getApplication().getController('Pedido').unir
            },{
                text: 'Liberar Mesa',
                scope: this,
                handler: this.getApplication().getController('Pedido').liberar
            },/*{
                text: 'Descuento'
            },*/{
                text: 'Resumen Diario',
                handler: this.getApplication().getController('Pedido').resumen
            },{
                text: 'Pagar',
                scope: this.getApplication().getController('Pedido'),
                handler: this.getApplication().getController('Pedido').pagar
            },{
                text: 'Anular Documento',
                handler: this.getApplication().getController('Pedido').anularDocumento
            },{
                text: 'Cierre Parcial',
                handler: this.getApplication().getController('Pedido').cierreParcial
            },{
                text: '' //Configuracion
            },{
                text: 'Cerrar Sesion',
                scope: this,
                handler: this.getApplication().getController('Main').cerraSesion
            }]
        });
        rewpos.Menu.PEDIDO = Ext.create('Ext.Menu', {
            cls: 'menupos',
            items: [{
                text: 'Cambiar Mesa',
                scope: this.getApplication().getController('Pedido'),
                handler: this.getApplication().getController('Pedido').cambiar
            },{
                text: 'Unir Mesas',
                scope: this,
                handler: this.getApplication().getController('Pedido').unir
            },{
                text: '' //Configuracion
            },{
                text: 'Cerrar Sesion',
                scope: this,
                handler: this.getApplication().getController('Main').cerraSesion
            }]
        });
        this.loadDefault();
    },
    cerraSesion: function(){
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
                    rewpos.AppGlobals.CAJERO=null;
                    Ext.getStore('Pago').removeAll();
                    Ext.getStore('Pedido').removeAll();
                    this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CAJA.get('empresa_name')+' - '+rewpos.AppGlobals.CAJA.get('centrocosto_name'));
                    this.getToolbarView().down('button[name=usuarioLogin]').setText('');
                    rewpos.Util.showPanel('mainCard', 'accesoView', 'right');
                }
            },
            scope: this
        });
    },
    loadDefault: function() {
        if (rewpos.AppGlobals.DEBUG) {
            rewpos.AppGlobals.CAJERO = Ext.create('rewpos.model.Usuario', {
                id: 99,
                nombre: 'Admin',
                apellido: '',
                usuario: 'root',
                centrocosto_id: 1,
                rol_id: 1
            });
            rewpos.AppGlobals.CAJA = Ext.create('rewpos.model.Caja', {
                id: 98,
                nombre: 'Admin',
                tipo: 'C',
                centrocosto_name: 'CC',
                empresa_name: 'EMPRESA'
            });
            this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CAJA.get('empresa_name')+' - '+rewpos.AppGlobals.CAJA.get('centrocosto_name'));
            this.getToolbarView().down('button[name=usuarioLogin]').setText(rewpos.AppGlobals.CAJERO.get('nombre'));
            this.getToolbarView().down('button[name=showmenu]').setHidden(true);
            Ext.getStore('Pedido').load({
                url: rewpos.AppGlobals.HOST+'pedido/1/'+rewpos.AppGlobals.CAJA_ID,
                callback: function(records) {
                    if(records.length>0){
                        this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(records[0].get('mozo_id'));
                        this.getSeleccionView().down('selectfield[name=cboPax]').setValue(records[0].get('pax'));
                    }
                },
                scope: this
            });
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
        }
    },
    setHeader: function(store) {
        //rewpos.app.getController('Pedido')
        this.getApplication().getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: '+store.getCount());
        this.getApplication().getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+rewpos.Util.toFixed(this.getTotales(store), 2));
        this.getApplication().getController('Pedido').getPagosView().down('label[name=lblTotalMontoPagar]').setHtml(rewpos.Util.toFixed(this.getTotales(store), 2));
    },
    getTotales: function(store) {
        var total = 0.0;
        store.each(function(item, index, length){
            total += item.get('cantidad') * item.get('precio');
        });
        return total;
    }
});