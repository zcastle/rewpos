Ext.define('rewpos.controller.Pedido', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Mesa','Pedido','Categoria','Producto'],
        models: ['Mesa','Pedido','Categoria','Producto'],
        refs: {
            editarForm: 'editarForm',
            seleccionView: 'seleccionView'
        },
        control: {
            'pedidoView': {
                activate: 'activate'
            },
            'seleccionView button': {
                tap: 'ontapSeleccion'
            },
            'seleccionView selectfield': {
                change: 'onChangeCbo'
            },
            'pedidoList': {
                itemtap: 'onItemTapPedidoList'
            },
            'categoriaList': {
                itemtap: 'onItemTapCategoriaList'
            },
            'productoList': {
                itemtap: 'onItemTapProductoList'
            }
        } 
    },
    activate: function(view) {},
    ontapSeleccion: function(btn) {
        switch(btn.name) {
            case 'btnSeleccionMesa':
                Ext.getStore('Mesa').load();
                Ext.getCmp('backToPedido').setHidden(false);
                Ext.getCmp('backToPedido').setText('MESA: '+btn.getText().substr(3));
                rewpos.Util.showPanel('mainCard', 'mesasView', 'left');
                break;
        }
    },
    onChangeCbo: function(cbo, newValue, oldValue) {
        //console.log(newValue);
        if(newValue>0 && Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mozo_id = this.getSeleccionView().down('selectfield[name=cboMozos]').getValue();
            var pax = this.getSeleccionView().down('selectfield[name=cboPax]').getValue();
            Ext.Viewport.setMasked(true);
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/actualizar',
                method: 'POST',
                params: {
                    nroatencion: nroatencion,
                    mozo_id: mozo_id,
                    pax: pax
                },
                callback: function(){
                    Ext.Viewport.setMasked(false);
                }
            });
        } else if(newValue==0 && Ext.getStore('Pedido').getCount()>0) {
            this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(oldValue);
        }
    },
    onItemTapPedidoList: function(item, index, target, record) {
        Ext.getCmp('textEditado').setValue('');
        this.getEditarForm().setRecord(record);
        rewpos.Util.showPanel('comando', 'editarForm', 'right');
    },
    onItemTapCategoriaList: function(item, index, target, record) {
        Ext.getStore('Producto').load({url: rewpos.AppGlobals.HOST+'producto/pos/categoria/'+record.get('id')});
        /*Ext.getStore('Producto').clearFilter();
        Ext.getStore('Producto').filter(function(producto) {
            if (producto.get('categoria_id')==record.get('id')) {
                return true;
            }
        });*/
        
        //Ext.getStore('Producto').filter('categoria_id', record.get('id'));
    },
    onItemTapProductoList: function(item, index, target, record) {
        var mesa = this.getSeleccionView().down('button[name=btnSeleccionMesa]').getText().substr(3);
        var mozo_id = this.getSeleccionView().down('selectfield[name=cboMozos]').getValue();
        var pax = this.getSeleccionView().down('selectfield[name=cboPax]').getValue();
        var existRecord = Ext.getStore('Pedido').findRecord('producto_id', record.getId());
        if (existRecord) {
            var cantidad = existRecord.get('cantidad')+1;
            existRecord.set('cantidad', cantidad);
            existRecord.save();
        } else {
            Ext.create('rewpos.model.Pedido', {
                nroatencion: mesa,
                cajero_id: rewpos.AppGlobals.USUARIO.get('id'),
                mozo_id: mozo_id,
                producto_id: record.get('id'),
                producto_name: record.get('nombre'),
                cantidad: 1,
                precio: record.get('precio'),
                cliente_id: '',
                caja_id: rewpos.AppGlobals.CAJA.get('id'),
                pax: pax,
                mensaje: '' 
            }).save({
                success: function(record) {
                    Ext.getStore('Pedido').add(record);
                },
                scope: this
            });
        }
    },
    pagar: function() {
        Ext.Viewport.toggleMenu('right');
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mozo_id = Ext.getStore('Pedido').getAt(0).get('mozo_id');
            if(mozo_id==0){
                Ext.Msg.alert('Advertencia', 'Debe seleccionar un mozo', Ext.emptyFn);
                return;
            }
            var mensaje = 'Pagar cuenta';
            var valorPedido = 0.0;
            Ext.getStore('Pedido').each(function(record, index, length){
                valorPedido += record.get('cantidad')*record.get('precio')
            }, this)
            Ext.getStore('Pago').load({
                url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
                callback: function(records, operation, success) {
                    if(records.length==0) {
                        mensaje = 'La cuenta se pagara con el monto exacto, desea continuar?';
                    } else {
                        var valorPago = 0.0;
                        Ext.Array.forEach(records, function(record) {
                            valorPago += record.get('valorpago')
                        }, this);
                        if((valorPedido-valorPago)>0) {
                            Ext.Msg.alert('Advertencia', 'Debe terminar de pagar la cuenta', Ext.emptyFn);
                            return;
                        }
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
                                        } else {
                                            Ext.Msg.alert('Advertencia', 'Error al pagar la cuenta', Ext.emptyFn);
                                        }
                                        Ext.Viewport.setMasked(false);
                                    }
                                });
                            }
                        },
                        scope: this
                    });
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido para procesar', Ext.emptyFn);
        }
    },
    liberar: function() {
        Ext.Viewport.toggleMenu('right');
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mensaje = 'Desea liberar la mesa: '+nroatencion;
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
                            url: rewpos.AppGlobals.HOST+'pedido/liberar',
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
                                    rewpos.Util.showPanel('comando', 'buscarView', 'left');
                                } else {
                                    Ext.Msg.alert('Advertencia', 'Error al liberar la mesa', Ext.emptyFn);
                                }
                                Ext.Viewport.setMasked(false);
                            }
                        });
                    }
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un mesa para liberar', Ext.emptyFn);
        }
    }
});