Ext.define('rewpos.controller.ClienteModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Ubigeo', 'Pedido'],
        models: ['Ubigeo','Cliente'],
        refs: {
            clienteModal: 'clienteModal'
        },
        control: {
            'clienteModal': {
                initialize: 'onInitialize'
            },
            'clienteModal searchfield': {
                action: 'onSearchAction',
                clearicontap: 'onSearchClearIconTap'
            },
            'clienteModal button': {
                tap: 'onTapButton'
            }
        } 
    },
    onInitialize: function(view) {
        if(Ext.getStore('Pedido').getCount()>0) {
            var ubigeo = new Array();
            Ext.getStore('Ubigeo').each(function(item){
                ubigeo.push({
                    text: item.get('nombre'),
                    value: item.get('id')
                })
            });
            view.down('selectfield').setOptions(ubigeo);
            
            var clienteId = Ext.getStore('Pedido').getAt(0).get('cliente_id');
            if(clienteId>0){
                Ext.ModelManager.getModel('rewpos.model.Cliente').load(clienteId,{
                    callback: function(record, operation) {
                        var form = this.getClienteModal();
                        if(record) {
                            form.setRecord(record);
                        } else {
                            form.setRecord(Ext.create('rewpos.model.Cliente',{id: null, ubigeo_id: "1393"}));
                            form.down('textfield[name=ruc]').focus();
                        }
                    },
                    scope: this
                });
            }
        }
    },
    onSearchAction: function(field, e) {
        var form = this.getClienteModal();
        var value = field.getValue();
        if(value.length==11 || value.length==8) {
            Ext.ModelManager.getModel('rewpos.model.Cliente').load('ruc/'+value,{
                callback: function(record, operation) {
                    if(record) {
                        form.setRecord(record);
                    } else {
                        form.setRecord(Ext.create('rewpos.model.Cliente',{ruc: value, id: null, ubigeo_id: "1393"}));
                        form.down('textfield[name=nombre]').focus();
                    }
                },
                scope: this
            });
        }
    },
    onSearchClearIconTap: function() {
        var form = this.getClienteModal();
        form.setRecord(Ext.create('rewpos.model.Cliente',{id: null, ubigeo_id: "1393"}));
    },
    onTapButton: function(btn) {
        switch(btn.getItemId()){
            case 'cancelar':
                Ext.Viewport.remove(btn.up('panel'));
                break;
            case 'aceptar':
                var form = this.getClienteModal();
                var fields = form.query("field");
                for (var i=0; i<fields.length; i++) {
                    fields[i].removeCls('invalidField');
                }
                var values = form.getValues();
                var ruc = values.ruc;
                if(ruc.length==11 || ruc.length==8) {

                } else {
                    Ext.Msg.alert('Advertencia', 'RUC invalido<br> el RUC debe contener 11 caracteres, en caso de DNI debe contener 8');
                    return;
                }

                var record = form.getRecord();
                record.set(values);
                var errors = record.validate();
                var errorString = '';
                function getLabel(campo) {
                    switch(campo){
                        case 'ruc':
                            return 'RUC';
                            break;
                        case 'nombre':
                            return 'Razon Social';
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
                    rewpos.Util.mask();
                    record.save({
                        callback: function(cliente, operation) {
                            this.actualizarCliente();
                            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                            Ext.Ajax.request({
                                url: rewpos.AppGlobals.HOST+'pedido/actualizar/cliente',
                                method: 'POST',
                                params: {
                                    nroatencion: nroatencion,
                                    clienteId: cliente.get('id')
                                },
                                callback: function(){
                                    rewpos.Util.unmask();
                                    this.getApplication().getController('Pedido').getPagosView().down('button[name=btnCliente]').setText(cliente.get('nombre'));
                                    Ext.getStore('Pedido').each(function(pedido){
                                        pedido.set('cliente_id', cliente.get('id'));
                                        pedido.set('cliente_name', cliente.get('nombre'));
                                    });
                                    Ext.Viewport.remove(btn.up('panel'));
                                }
                            });
                            
                        },
                        scope: this
                    });
                }
                break;
        }
    }
});