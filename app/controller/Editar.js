Ext.define('rewpos.controller.Editar', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido'],
        models: ['Pedido'],
        refs: {
            editarForm: 'editarForm'
        },
        textFieldActive: null,
        control: {
            'editarForm': {
                activate: 'activate'
            },
            'editarForm button': {
                tap: 'onTapClick'
            },
            'teclado radiofield': {
                check: 'onCheck'
            },
            'teclado button[name=accion]': {
                tap: 'onTapAccion'
            },
            'tecladoNumerico button[name=num]': {
                tap: 'onTapNum'
            }
        } 
    },
    activate: function(view) {},
    onTapClick: function(btn) {
        var form = this.getEditarForm();
        var record = form.getRecord();
        switch(btn.name) {
            case 'btnEditar':
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
                            record.set(values);
                            record.save();
                        }
                    },
                    scope: this
                });
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
                            record.erase({
                                success: function() {
                                    Ext.getStore('Pedido').remove(record);
                                }
                            });
                        }
                    },
                    scope: this
                });
                break;
        }
    },
    onCheck: function(radio) {
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
    }
});