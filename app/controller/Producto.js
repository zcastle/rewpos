Ext.define('rewpos.controller.Producto', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido','Categoria', 'Producto'],
        refs: {
            seleccionView: 'seleccionView',
            pedidoList: 'pedidoList',
            productoList: 'productoList'
        },
        control: {
            'productoView searchfield': {
                keyup: 'onSearchKeyUp',
                clearicontap: 'onSearchClearIconTap'
            },
            'categoriaList': {
                select: 'onSelectCategoriaList'
            },
            'productoList': {
                itemdoubletap: 'onItemDoubleTapProductoList',
                select: 'onSelectProductoList'
            },
            'productoTouchView button': {
                tap: 'onTapButtonCategorias'
            },
            'productoTouchView searchfield': {
                keyup: 'onSearchKeyUp',
                clearicontap: 'onSearchClearIconTap'
            },
            'categoriaDataView': {
                itemtap: 'onItemTapCategoria'
            },
            'productoDataView': {
                itemtap: 'onItemTapProducto'
            }
        } 
    },
    onSearchKeyUp: function(field, e) {
        //e.event.preventDefault();
        var keyCode = e.event.keyCode;
        if(keyCode == 13) {
            var value = field.getValue();
            if(value.length>=3) {
                rewpos.Util.mask('Buscando...', true);
                Ext.getStore('Producto').load({
                    url: rewpos.AppGlobals.HOST+'producto/pos/buscar/'+value,
                    callback: function(records) {
                        rewpos.Util.unmask(true);
                        //rewpos.Util.showPanel('productosCard', 'productoDataView', 'right');
                        if(records.length>0){
                            rewpos.Util.showPanel('productosCard', 'productoList', 'right');
                            /*if(this.getProductoList()==undefined || this.getProductoList()==null) return;
                            if(this.getProductoList().getSelection().length==0){
                                this.getProductoList().select(0);
                                rewpos.AppGlobals.LIST_SELECTED = this.getProductoList();
                            }*/
                        } else {
                            rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                        }
                    },
                    scope: this
                });
            } else if(value.length==0) {
                Ext.getStore('Producto').setData([]);
            }
        } else if(keyCode == 40) {
            if(Ext.getStore('Producto').getCount()>0){
                if(this.getProductoList().getSelection().length==0){
                    this.getProductoList().select(0);
                }
            }
        }
    },
    onSearchClearIconTap: function() {
        rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
        Ext.getStore('Producto').setData([]);
    },
    onSelectCategoriaList: function(list, record){
        rewpos.AppGlobals.LIST_SELECTED = list;
        rewpos.Util.mask('Cargando...', true);
        Ext.getStore('Producto').load({
            url: rewpos.AppGlobals.HOST+'producto/pos/categoria/'+record.get('id'),
            callback: function(){
                rewpos.Util.unmask(true);
                rewpos.Util.showPanel('productosCard', 'productoDataView', 'right');
            },
            scope: this
        });
    },
    onSelectProductoList: function(list, records) {
        rewpos.AppGlobals.LIST_SELECTED = list;
    },
    onItemDoubleTapProductoList: function(item, index, target, record) {
        var existRecord = Ext.getStore('Pedido').findRecord('producto_id', record.getId());
        var list = this.getApplication().getController('Producto').getPedidoList();
        var clienteId = 0;
        if(Ext.getStore('Pedido').getCount()>0) {
            clienteId = Ext.getStore('Pedido').getAt(0).get('cliente_id');
        }
        if (existRecord) {
            if(existRecord.get('enviado')=='S') {
                Ext.Msg.show({
                    //title: "Confirmacion", 
                    message: "Desea enviar el producto?",
                    buttons:  [{
                        itemId: 'no',
                        text: 'No'
                    },{
                        itemId: 'yes',
                        text: 'Si'
                    }],
                    fn: function(btn) {
                        if(btn=='yes'){
                            this.existProducto(existRecord, list, clienteId)
                            rewpos.Util.mask();
                            Ext.Ajax.request({
                                url: rewpos.AppGlobals.HOST_PRINT+'print/pedido/add/'+existRecord.get('id')+'/1',
                                callback: function(request, success, response){
                                    rewpos.Util.unmask();
                                    var text = Ext.JSON.decode(response.responseText);
                                    if(!text.success) {
                                        Ext.Msg.alert('Advertencia', 'Error al ENVIAR PRODUCTO', Ext.emptyFn);
                                    }
                                }
                            });
                        } else if(btn=='no') {
                            this.addProducto(record, list, clienteId);
                        }
                    },
                    scope: this
                });
            } else {
                this.existProducto(existRecord, list, clienteId)
            }
        } else {
            this.addProducto(record, list, clienteId);
        }
    },
    existProducto: function(existRecord, list, clienteId) {
        var cantidad = existRecord.get('cantidad')+1;
        existRecord.set('cantidad', cantidad);
        if(clienteId>0) {
            existRecord.set('cliente_id', clienteId);
        }
        existRecord.save();
        list.scrollToRecord(existRecord);
        list.select(existRecord);
    },
    addProducto: function(record, list, clienteId) {
        var mesa = this.getSeleccionView().down('button[name=btnSeleccionMesa]').getText().substr(3);
        var mozo_id = this.getSeleccionView().down('selectfield[name=cboMozos]').getValue();
        var pax = this.getSeleccionView().down('selectfield[name=cboPax]').getValue();
        var tipoDocumentoId = clienteId > 0 ? 2 : 4;
        rewpos.Util.mask('Insertando...', true);
        Ext.create('rewpos.model.Pedido', {
            nroatencion: mesa,
            cajero_id: rewpos.AppGlobals.CAJERO.get('id'),
            mozo_id: mozo_id,
            producto_id: record.get('id'),
            producto_name: record.get('nombre'),
            cantidad: 1,
            precio: record.get('precio'),
            cliente_id: clienteId,
            caja_id: rewpos.AppGlobals.CAJA_ID,
            pax: pax,
            mensaje: '',
            tipo_documento_id: tipoDocumentoId
        }).save({
            success: function(pedido) {
                Ext.getStore('Pedido').add(pedido);
                rewpos.Util.unmask(true);
                //list.select(pedido);
                //list.scrollToRecord(pedido);
            },
            scope: this
        });
    },
    onTapButtonCategorias: function() {
        rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
    },
    onItemTapCategoria: function(view, index, target, record) {
        this.onSelectCategoriaList(null, record);
        //rewpos.Util.showPanel('productosCard', 'productoDataView', 'right');
    },
    onItemTapProducto: function(view, index, target, record) {
        this.onItemDoubleTapProductoList(null, null, null, record)
    }
});