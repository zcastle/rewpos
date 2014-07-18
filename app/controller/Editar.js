Ext.define('rewpos.controller.Editar', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Pedido'],
        refs: {
            editarForm: 'editarForm',
            pedidoList: 'pedidoList'
        },
        textFieldActive: null,
        control: {
            'editarForm': {
                activate: 'activate'
            },
            'editarForm button': {
                tap: 'onTapClick'
            }/*,
            'teclado radiofield': {
                check: 'onCheck'
            },
            'teclado button[name=accion]': {
                tap: 'onTapAccion'
            },
            'tecladoNumerico button[name=num]': {
                tap: 'onTapNum'
            }*/
        } 
    },
    activate: function(view) {},
    onTapClick: function(btn) {
        var form = this.getEditarForm();
        var record = form.getRecord();
        var fields = form.query("field");
        switch(btn.name) {
            case 'btnEditar':
                for (var i=0; i<fields.length; i++) {
                    fields[i].removeCls('invalidField');
                }
                var values = form.getValues();
                var oldValue = record.get('cantidad');
                var newValue = values.cantidad;
                record.set(values);
                var errors = record.validate();
                var errorString = '';
                function getLabel(campo) {
                    switch(campo){
                        case 'producto_name':
                            return 'Producto';
                            break;
                        case 'cantidad':
                            return 'Cantidad';
                            break;
                        case 'precio':
                            return 'Precio';
                            break;
                    }
                }
                if(!errors.isValid()) {
                    errors.each(function (errorObj){
                        errorString += getLabel(errorObj.getField())+"<br>";
                        var s = Ext.String.format('field[name={0}]',errorObj.getField());
                        form.down(s).addCls('invalidField');
                    });
                    Ext.Msg.alert('Advertencia', 'Debe ingresar los siguientes campos: <br>'+errorString);
                } else {
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
                                record.save();
                                if(record.get('enviado')=='N') return;
                                var diferencia = Math.abs(newValue - oldValue);
                                var url;
                                if(newValue>oldValue) {
                                    url = rewpos.AppGlobals.HOST_PRINT+'print/pedido/add/'+record.get('id')+'/'+diferencia
                                } else {
                                    url = rewpos.AppGlobals.HOST_PRINT+'print/pedido/remove/'+record.get('id')+'/'+diferencia
                                }
                                rewpos.Util.mask();
                                Ext.Ajax.request({
                                    url: url,
                                    callback: function(request, success, response){
                                        rewpos.Util.unmask();
                                        var text = Ext.JSON.decode(response.responseText);
                                        if(!text.success) {
                                            Ext.Msg.alert('Advertencia', 'Error al ENVIAR/REMOVER PRODUCTO', Ext.emptyFn);
                                        }
                                    }
                                });
                            }
                        },
                        scope: this
                    });
                }
                break;
            case 'btnEliminar':
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
                            rewpos.Util.mask();
                            record.erase({
                                success: function() {
                                    rewpos.Util.unmask();
                                    //
                                    var list = rewpos.app.getController('Editar').getPedidoList();
                                    list.select(0);
                                    //
                                    Ext.getStore('Pedido').remove(record);
                                    if(record.get('enviado')=='S') {
                                        console.log('Enviando anulacion');
                                        Ext.Ajax.request({
                                            url: rewpos.AppGlobals.HOST_PRINT+'print/pedido/remove/'+record.get('id')+'/'+record.get('cantidad'),
                                            callback: function(request, success, response){
                                                var text = Ext.JSON.decode(response.responseText);
                                                if(!text.success) {
                                                    Ext.Msg.alert('Advertencia', 'Error al ELIMINAR PRODUCTO', Ext.emptyFn);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    },
                    scope: this
                });
                break;
        }
    }
    /*onCheck: function(radio) {
        this.textFieldActive = this.getEditarForm().down('textfield[name='+radio.getValue()+']');
        Ext.getCmp('textEditado').setValue('');
        Ext.getCmp('textEditado').setPlaceHolder(this.textFieldActive.getValue());
        
    },
    onTapNum: function(btn) {
        var text = Ext.getCmp('textEditado');
        if(btn.getText()=='.' && text.getValue().indexOf(".")>-1) return;
        text.setValue(text.getValue()+btn.getText());
    },
    onTapAccion: function(btn) {
        if (this.textFieldActive != undefined) {
            var txtEdit = Ext.getCmp('textEditado');
            switch(btn.id) {
                case 'btnTecladoEnter':
                    if (txtEdit.getValue()!="" && this.textFieldActive.getName()!='nombre' && this.textFieldActive.getName()!='mensaje') {
                        this.textFieldActive.setValue(txtEdit.getValue());
                        Ext.getCmp('textEditado').setValue('');
                    }
                    break;
                case 'btnTecladoBorrar':
                    var oldValue = txtEdit.getValue();
                    var newValue = oldValue.substring(0, oldValue.length-1);
                    txtEdit.setValue(newValue);
                    break;
            }
        }
    }*/
});