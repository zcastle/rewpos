Ext.define('rewpos.controller.TecladoFull', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            'tecladoFull': {
                show: 'show'
            },
            'tecladoFull textfield': {
                onKeyUp: 'onKeyUp'
            }
        } 
    },
    show: function(view) {
    	if(Ext.os.deviceType=='Tablet') {
    		view.down('textfield[name=texto]').focus();
    	}
    },
    onKeyUp: function(field, e) {
        /*var keyCode = e.event.keyCode;
        if(keyCode == 13) {
            e.event.stopEvent();
        }*/
    }
});