Ext.define('rewpos.controller.CambiarMesaModal', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            cambiarMesaModal: 'cambiarMesaModal'
        },
        control: {
            'cambiarMesaModal': {
                hide: 'onHide'
            },
            'cambiarMesaModal button[action=cancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'cambiarMesaModal button[name=num]': {
                tap: 'onTapNum'
            }
        } 
    },
    onHide: function(view) {
        Ext.Viewport.remove(view);
    },
    onTapButtonCancelar: function(btn) {
        Ext.Viewport.remove(btn.up('panel'));
    },
    onTapNum: function(btn) {
        var mesaDestino = this.getCambiarMesaModal().down('numberfield[name=mesaDestino]');
        if(btn.getText()=='<<') {
            mesaDestino.setValue('');
        } else {
            if(mesaDestino.getValue()==null){
                mesaDestino.setValue(btn.getText());
            } else {
                mesaDestino.setValue(mesaDestino.getValue()+btn.getText());
            }
        }
    }
});