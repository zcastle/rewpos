Ext.define('rewpos.view.ChatView', {
    extend: 'Ext.Container',
    xtype: 'chatView',
    config: {
        layout: 'vbox',
        items: [{
            xtype: 'list',
            width: 300
        },{
            xtype: 'list',
            flex: 1
        }]
    }
});
