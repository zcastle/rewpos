Ext.define('rewpos.controller.TecladoPrecioModal', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            tecladoPrecioModal: 'tecladoPrecioModal'
        },
        control: {
            'tecladoPrecioModal': {
                hide: 'onHide'
            },
            'tecladoPrecioModal button[action=cancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'tecladoPrecioModal button[name=num]': {
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
        var precioNew = this.getTecladoPrecioModal().down('textfield[name=precioNew]');
        if(btn.getItemId()=='borrar') {
            precioNew.setValue('');
        } else {
            if(btn.getText()=='.' && precioNew.getValue().indexOf(".")>-1) return;
            precioNew.setValue(precioNew.getValue()+btn.getText());
        }
    }
});