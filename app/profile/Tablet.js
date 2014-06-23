Ext.define('tienda.profile.Tablet', {
    extend: 'Ext.app.Profile',

    views: ['Main'],

    isActive: function() {
        return Ext.os.is('Phone');
    }
});