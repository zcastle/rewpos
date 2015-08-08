Ext.define('rewpos.controller.ConfigModal', {
    extend: 'Ext.app.Controller',
    config: {
        models: ['Config'],
        refs: {
            configModal: 'configModal'
        },
        control: {
            'configModal': {
                initialize: 'onInitialize',
                hide: 'onHide'
            },
            'configModal button[action=cancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'configModal button[action=aceptar]': {
                tap: 'onTapButtonAceptar'
            }
        } 
    },
    onInitialize: function(view) {
        var form = this.getConfigModal();
        Ext.ModelManager.getModel('rewpos.model.Config').load(1,{
            callback: function(record, operation) {
                if(record) {
                    form.setRecord(record);
                } else {
                    form.setRecord(Ext.create('rewpos.model.Config', {
                        id: 1,
                        caja_id: 2,
                        print_server: 'localhost',
                        print_port: '8523'
                    }));
                }
            },
            scope: this
        });
    },
    onHide: function(view) {
        Ext.Viewport.remove(view);
    },
    onTapButtonCancelar: function(btn) {
        Ext.Viewport.remove(btn.up('panel'));
    },
    onTapButtonAceptar: function(btn){
        var form = this.getConfigModal();
        var fields = form.query("field");
        for (var i=0; i<fields.length; i++) {
            fields[i].removeCls('invalidField');
        }
        var values = form.getValues();
        var record = form.getRecord();
        record.set(values);
        var errors = record.validate();
        function getLabel(campo) {
            switch(campo){
                case 'caja_id':
                    return 'CAJA ID';
                    break;
                case 'print_server':
                    return 'PRINT SERVER';
                    break;
                case 'print_port':
                    return 'PUERTO';
                    break;
            }
        }
        if(!errors.isValid()) {
            var errorString = '';
            errors.each(function (errorObj){
                errorString += getLabel(errorObj.getField())+"<br>";
                var s = Ext.String.format('field[name={0}]',errorObj.getField());
                form.down(s).addCls('invalidField');
            });
            Ext.Msg.alert('Advertencia', 'Debe ingresar los siguientes campos: <br>'+errorString);
        } else {
            Ext.create('rewpos.model.Config', {
                id: 1,
                caja_id: record.get('caja_id'),
                print_server: record.get('print_server'),
                print_port: record.get('print_port')
            }).save({
                callback: function(){
                    window.location.reload();
                }
            });
        }
    }
});