Ext.define('rewpos.controller.Editar', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Pedido'],
        refs: {
            editarForm: 'editarForm',
            pedidoList: 'pedidoList'
        },
        control: {
            'editarForm button[name=btnEditar]': {
                tap: 'onTapClickEditar'
            },
            'editarForm button[name=btnEliminar]': {
                tap: 'onTapClickEliminar'
            },
            'editarForm button[name=btnTecladoCantidad]': {
                tap: 'onTapClickTecladoCantidad'
            },
            'editarForm textareafield': {
                focus: 'onFocusTxtMensaje'
            }
        } 
    },
    onTapClickEditar: function(btn) {
        var form = this.getEditarForm();
        var record = form.getRecord();
        var fields = form.query("field");
        Ext.Msg.show({
            title: "Confirmacion", 
            message: "Desea editar el producto?",
            buttons:  [{
                itemId: 'no',
                text: 'No'
            },{
                itemId: 'yes',
                text: 'Si'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    var values = form.getValues();
                    var oldValue = record.get('cantidad');
                    var newValue = values.cantidad;
                    record.set(values);
                    record.save();
                    if(record.get('enviado')=='S') {
                        var diferencia = Math.abs(newValue - oldValue);
                        var url;
                        if(newValue>oldValue) {
                            //url = rewpos.AppGlobals.HOST_PRINT+'pedido/add/'+record.get('id')+'/'+diferencia
                            url = 'pedido/add/'+record.get('id')+'/'+diferencia
                        } else {
                            //url = rewpos.AppGlobals.HOST_PRINT+'pedido/remove/'+record.get('id')+'/'+diferencia
                            url = 'pedido/remove/'+record.get('id')+'/'+diferencia
                        }
                        rewpos.Util.mask();
                        Ext.ModelManager.getModel('rewpos.model.Imprimir').load(url,{
                            callback: function(record, operation) {
                                rewpos.Util.unmask();
                            },
                            scope: this
                        });
                        /*Ext.Ajax.request({
                            url: url,
                            disableCaching: false,
                            useDefaultXhrHeader: false,
                            callback: function(request, success, response){
                                rewpos.Util.unmask();
                                var text = Ext.JSON.decode(response.responseText);
                                if(!text.success) {
                                    Ext.Msg.alert('Advertencia', 'Error al ENVIAR/REMOVER PRODUCTO', Ext.emptyFn);
                                }
                            }
                        });*/
                    }
                }
            },
            scope: this
        });
    },
    onTapClickEliminar: function(btn) {
        Ext.Msg.show({
            title: "Confirmacion", 
            message: "Desea eliminar el producto?",
            buttons:  [{
                itemId: 'no',
                text: 'No'
            },{
                itemId: 'yes',
                text: 'Si'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    var form = this.getEditarForm();
                    var record = form.getRecord();
                    Ext.getStore('Pedido').remove(record);
                    if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                        rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                    } else {
                        rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                    }
                    if(record.get('enviado')=='S') {
                        Ext.ModelManager.getModel('rewpos.model.Imprimir').load('pedido/remove/'+record.get('id')+'/'+record.get('cantidad'),{
                            callback: function(record, operation) {
                            },
                            scope: this
                        });
                    }
                    rewpos.Util.mask();
                    record.erase({
                        success: function() {
                            rewpos.Util.unmask();
                        }
                    });
                }
            },
            scope: this
        });
    },
    onTapClickTecladoCantidad: function(btn){
        var form = this.getEditarForm();
        var values = form.getValues();
        var precioOld = values.precio;
        var modal = Ext.Viewport.add({xtype: 'tecladoPrecioModal'});
        var txtPrecioOld = modal.down('textfield[name=precioOld]');
        var txtPrecioNew = modal.down('textfield[name=precioNew]');
        var btnOk = modal.down('button[action=ok]');
        modal.down('textfield[name=producto]').setValue(values.producto_name);
        txtPrecioOld.setValue(precioOld);
        btnOk.addListener('tap', function(btn){
            var precio = txtPrecioNew.getValue() || 0;
            precio = Ext.data.Types.NUMBER.convert(precio);
            if (precio<0.1) {
                Ext.Msg.alert('Advertencia', 'El precio debe ser mayor a CERO', Ext.emptyFn);
                txtPrecioNew.setValue('');
                return;
            }
            Ext.Viewport.remove(btnOk.up('panel'));
            form.query("field[name=precio]")[0].setValue(txtPrecioNew.getValue());
        });
    },
    onFocusTxtMensaje: function(txt, e) {
        if(Ext.os.deviceType=='Tablet') {
            rewpos.Util.showPanel('mainCard', 'tecladoFull', 'left');
            var tecladoFull = Ext.getCmp('tecladoFull');
            var productoName = tecladoFull.down('textfield[name=producto_name]');
            var text = tecladoFull.down('textfield[name=texto]');
            var btnEnter = tecladoFull.down('button');
            var form = this.getEditarForm();
            var values = form.getValues();
            productoName.setValue(values.producto_name);
            text.setValue(txt.getValue());
            btnEnter.addListener('tap', function(btn){
                txt.setValue(text.getValue());
                rewpos.Util.showPanel('mainCard', 'pedidoView', 'right');
            });
        }
    }
});