Ext.define('rewpos.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario', 'Pago', 'Pedido'],
        models: ['Usuario', 'Corporacion', 'Caja'],
        refs: {
            seleccionView: 'seleccionView',
            pedidoList: 'pedidoList',
            productoList: 'productoList',
            toolbarView: 'toolbarView'
        },
        control: {
            'main': {
                activate: 'activate'
            }
        } 
    },
    activate: function() {
        console.log('POS Listo');
        console.log('Debug is '+rewpos.AppGlobals.DEBUG);
        //console.log(Ext.os.deviceType);
        //console.log('Ext.os.deviceType');
        //
        //this.db();
        //
        $('.x-scroll-view').mousewheel(function(event) {
            event.preventDefault();
            //console.log(event.deltaX, event.deltaY, event.deltaFactor);
            var scrollTop = this.scrollTop;
            this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
        });

        function selectList(list, index) {
            list.select(index);
            var record = list.getSelection()[0];
            list.scrollToRecord(record);
        }
        if(Ext.os.deviceType=='Desktop') {
            $(document.body).keydown(function(event) {
                //console.log(event);
                var list = rewpos.AppGlobals.LIST_SELECTED; //rewpos.app.getController('Main').getPedidoList();
                if(list==null) return;
                //console.log(event.which);
                var store = rewpos.AppGlobals.LIST_SELECTED.getStore();
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
                        switch(list.getId()) {
                            case 'pedidoList':
                                break;
                            case 'categoriaList':
                                break;
                            case 'productoList':
                                var record = list.getSelection()[0];
                                rewpos.app.getController('Producto').onItemDoubleTapProductoList(null, null, null, record);
                                break;
                        }
                    } else if(event.which==37) { //KEY LEFT
                        if(list.getId()=='categoriaList') {
                            rewpos.app.getController('Main').getProductoList().select(0);
                        }
                    }
                }
            });
        }
        /**/
        //Ext.getStore('Producto').load();
        Ext.Msg.defaultAllowedConfig.showAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.Msg.defaultAllowedConfig.hideAnimation = rewpos.AppGlobals.ANIMACION;
        Ext.ModelManager.getModel('rewpos.model.Corporacion').load(rewpos.AppGlobals.DEFAULT_CORPORACION,{
            success: function(corporacion) {
                rewpos.AppGlobals.CORPORACION = corporacion.get('nombre');
                this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CORPORACION);
                this.loadDefault();
            },
            scope: this
        });
        Ext.getStore('Usuario').load({
            callback: function(records, operation, success) {
                var mozos = new Array();
                mozos.push({
                    text: 'Elegir Mozo',
                    value: 0
                });
                Ext.Array.forEach(records, function(item) {
                    if (item.get('rol_id')==rewpos.AppGlobals.ROL_ID_MOZO) {
                        mozos.push({
                            text: item.get('nombre')+' '+item.get('apellido'),
                            value: item.get('id')
                        })
                    }
                }, this);
                this.getSeleccionView().down('selectfield[name=cboMozos]').setOptions(mozos);
            },
            scope: this
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
        rewpos.Menu.USUARIO = Ext.create('Ext.Menu', {
            cls: 'menupos',
            items: [{
                text: 'Cambiar Mesa',
                handler: rewpos.app.getController('Pedido').cambiar
            },{
                text: 'Unir Mesas',
                handler: rewpos.app.getController('Pedido').unir
            },{
                text: 'Liberar Mesa',
                handler: rewpos.app.getController('Pedido').liberar
            },/*{
                text: 'Descuento'
            },*/{
                text: 'Resumen Diario',
                handler: rewpos.app.getController('Pedido').resumen
            },{
                text: 'Pagar',
                handler: rewpos.app.getController('Pedido').pagar
            },{
                text: 'Anular Documento',
                handler: rewpos.app.getController('Pedido').anularDocumento
            },{
                text: 'Cierre Parcial',
                handler: rewpos.app.getController('Pedido').cierreParcial
            },{
                text: '' //Configuracion
            },{
                text: 'Cerrar Sesion',
                handler: rewpos.app.getController('Main').cerraSesion
            }]
        });
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
                    Ext.getStore('Pago').removeAll();
                    Ext.getStore('Pedido').removeAll();
                    this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CORPORACION);
                    this.getToolbarView().down('button[name=usuarioLogin]').setText('');
                    rewpos.Util.showPanel('mainCard', 'accesoView', 'right');
                }
            },
            scope: rewpos.app.getController('Main')
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
            this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CAJA.get('empresa_name')+' - '+rewpos.AppGlobals.CAJA.get('centrocosto_name'));
            this.getToolbarView().down('button[name=usuarioLogin]').setText(rewpos.AppGlobals.USUARIO.get('nombre'));
            this.getToolbarView().down('button[name=showmenu]').setHidden(true);
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');

            Ext.getStore('Pedido').load({
                params: {
                    mesa: 0
                },
                callback: function(records) {
                    if(records.length>0){
                        this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(records[0].get('mozo_id'));
                        this.getSeleccionView().down('selectfield[name=cboPax]').setValue(records[0].get('pax'));
                    }
                },
                scope: this
            });
            this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: 0');
        }
    },
    db: function() {
        var html5rocks = {};
        html5rocks.webdb = {};

        html5rocks.webdb.db = null;
        html5rocks.webdb.open = function() {
            var dbSize = 1 * 1024 * 1024; // 1MB
            html5rocks.webdb.db = openDatabase("Todo", "1", "Todo manager", dbSize);
        }

        html5rocks.webdb.onError = function(tx, e) {
            console.log("There has been an error: " + e.message);
        }

        html5rocks.webdb.onSuccess = function(tx, r) {
            console.log("SUCCESS");
        }

        html5rocks.webdb.createTable = function() {
            var db = html5rocks.webdb.db;
            db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS producto(" +
                    "id INTEGER PRIMARY KEY ASC, "+
                    "nombre TEXT, "+
                    "precio FLOAT, "+
                    "orden INTEGER, "+
                    "categoria_id INTEGER"+
                    ")", []);
            });
        }

        html5rocks.webdb.addProducto = function(nombre, precio, orden, categoria_id) {
            var db = html5rocks.webdb.db;
            db.transaction(function(tx){
                //var addedOn = new Date();
                tx.executeSql(
                    "INSERT INTO producto(nombre, precio, orden, categoria_id) "+
                    "VALUES (?,?,?,?)",
                    [nombre, precio, orden, categoria_id],
                    html5rocks.webdb.onSuccess,
                    html5rocks.webdb.onError
                );
            });
        }

        html5rocks.webdb.getAllProductos = function(renderFunc) {
            var db = html5rocks.webdb.db;
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM producto", [], renderFunc, html5rocks.webdb.onError);
            });
        }

        html5rocks.webdb.open();
        html5rocks.webdb.createTable();
        //html5rocks.webdb.addProducto('PRODUCTO 1', 10.0, 1, 1);
        html5rocks.webdb.getAllProductos(this.loadProductosItems);

        console.log(html5rocks);
    },
    loadProductosItems: function(tx, rs) {
        console.log('loadProductosItems');
        for (var i=0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            console.log(row);
        }
    }
});